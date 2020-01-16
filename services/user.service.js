"use strict";

const User = require("../model/entities/user.model");
const vm = require("./utility.core/view.model.builder");
const timeLine = require("./activity.service");
const utility = require("./utility.core/utility");
const jwt = require("jsonwebtoken");
const config = require("../services/utility.core/config");
const notify = require("../services/notification.service");
const notifyType = require("../model/enums/notificationType");
const planService = require("../services/plan.service");
const { appSetting } = require("../appsetting");
const { passwordResetService } = require("./password-reset.service");
const { mailingService } = require("./mailing.service");
const { ObjectId } = require("mongoose").Types;

module.exports = {
	/**
	 * Create new object
	 * @param  {User} user new user object
	 * @param {string} referral user email address of the person that referred the new user
	 */
	async addUser(user, referral) {
		// check if  current app settings allows email verification
		if (appSetting.all.validateEmail) {
			const email_state = await utility.isEmailValid(user.email);
			if (!email_state)
				return {
					status: 500,
					message: "Email address is invalid."
				};
		}
		// check wallet address
		if (appSetting.all.validateWalletAddress) {
			const v = await utility.isWalletValid(user.walletId);
			if (!v)
				return {
					status: 500,
					message: `Can't verify your '${
						user.walletId
					}'  Bitcoin address! Try again later.`
				};
		}
		// check user
		if (await this.doesUserExistUsingEmail(user.email)) {
			return {
				status: 500,
				message: `User account with email '${
					user.email
				}' already exist, try logging in instead.`
			};
		}
		// check for exiting bitcoin address
		if (await this.DoesWalletAddressExists(user.walletId))
			return {
				status: 500,
				message: `User with '${user.walletId}' already exists!`
			};

		// referer user id
		let ref;
		try {
			ref = await this.getUserByEmail(referral);
		} catch (error) {
			// add user to data
			const userModel = new User({
				name: user.name,
				email: user.email,
				passwordHash: user.password,
				address: user.address,
				city: user.city,
				zipCode: user.zipcode,
				isAdmin: user.admin || false,
				bitcoinWalletAddress: user.walletId,
				plan: {
					plan: user.planId
				}
			});
			// console.log(JSON.stringify(userModel, null, 6));
			if (ref) {
				userModel.referrer = ref._id;
			}
			try {
				const newUser = await userModel.save();
				if (newUser) {
					//log activity
					await timeLine.addToTimeline(
						newUser._id,
						"You successfully created an account."
					);

					return {
						status: 200,
						message: "Account created successfully",
						doc: newUser
					};
				} else {
					return {
						status: 500,
						message: "User can not be created."
					};
				}
			} catch (error) {
				return {
					status: 500,
					message: error.message
				};
			}
		}
	},
	/**
	 * get list of current users.
	 * @param  {Number} page
	 * @param  {Number} limit
	 */
	async getUsers(page, limit) {
		// Query
		const query = { removed: false };

		const option = {
			populate: ["plan.plan", "plan.plan.service"],
			limit: limit || 25,
			page: page || 1,
			sort: { dateCreated: -1 }
		};

		const result = await User.paginate(query, option);
		// console.log(JSON.stringify(result, null, 6));
		return {
			status: 200,
			message: "Completed!",
			docs: result.docs.map(u => vm.buildFullUserVm(u)),
			total: result.total,
			limit: result.limit,
			pages: result.pages,
			page: result.page
		};
	},
	// single user
	/**
	 * Get single user object using id
	 * @param  {string} id user id
	 */
	async getUser(id) {
		if (ObjectId.isValid(id)) {
			const user = User.findById(id)
				.populate(["plan.plan"])
				.exec();
			return user ? user : {};
		}
		return {};
	},
	/**
	 * This allows a user to choose a suitable investment plan
	 * @param  {String} user id of user subscribing to the investment plan
	 * @param  {string} planid id of the investment plan
	 */
	async subscribToPlan(user, planid) {
		//validation
		if (ObjectId.isValid(user) && ObjectId.isValid(planid)) {
			// check if plan exist
			const isPlan = await planService.doesPlanExist(planid);
			// check if user exist
			const isUser = await this.doesUserExist(user);
			if (isPlan && isUser) {
				const update = await User.updateOne(
					{ _id: user },
					{
						$set: { "plan.plan": planid },
						$currentDate: { "plan.lastModified": true }
					}
				).exec();
				// log
				if (update.ok > 0) {
					const plan = await planService.getSinglePlan(planid);
					await timeLine.addToTimeline(
						user,
						`You've subscribed to ${plan.doc.title}`
					);
					return {
						status: 200,
						message: "Plan subscription completed successfully!"
					};
				}
			}
		}
		return {
			status: 500,
			message: "Failed! Unable to subscribe to selected plan."
		};
	},
	/**
	 * Update user's information
	 * @param  {string} id user id
	 * @param  {UserViewModel} model new model
	 */
	async updateAccount(id, model) {
		try {
			const result = await User.updateOne(
				{ _id: id },
				{
					$set: {
						name: model.name,
						address: model.address,
						zipCode: model.zipcode,
						city: model.city
					},
					$currentDate: {
						lastModified: true
					}
				}
			).exec();
			// log
			if (result.ok > 0) {
				await timeLine.addToTimeline(id, "You updated your account.");
				return true;
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}
	},
	/**
	 * This function suspends user's account
	 * @param  {String} id
	 * @param  {Boolean} state
	 */
	async toggleAccountSuspension(id, state) {
		//valiation
		if (ObjectId.isValid(id)) {
			const account = await User.updateOne(
				{ _id: id },
				{
					$set: { suspended: state },
					$currentDate: { lastModified: true }
				}
			).exec();
			if (account.ok > 0) {
				const message = state
					? "Your account was suspended."
					: "Your account suspension has been resolved.";
				// log activity
				await timeLine.addToTimeline(id, message);
				return true;
			}
		}
		return false;
	},

	/**
	 * Check if user already exists
	 * @param  {String} id user id
	 */
	async doesUserExist(id) {
		const result = await User.find({ _id: id }).exec();

		return result.length > 0;
	},
	async doesUserExistUsingEmail(email) {
		const result = await User.find({
			email: email
		}).exec();

		return result.length > 0;
	},
	/**
	 * Change user admin rights to either true or false
	 * depending on state value
	 * @param  {String} id
	 * @param  {Boolean} state
	 */
	async toggleUserAdminRights(id, state) {
		// validation
		if (ObjectId.isValid(id)) {
			const update = await User.findOneAndUpdate(
				{ _id: id },
				{ isAdmin: state }
			);
			if (update) {
				const message = state
					? "You have been given an admin rights."
					: "You no longer have admin rights.";
				// log activity
				await timeLine.addToTimeline(id, message);
				return true;
			}
		}
		return false;
	},
	/**
	 * User Account login using email and password
	 * @param  {String} email User's emaill address
	 * @param  {String} password User's password
	 */
	async login(email, password) {
		const user = await this.getUserByEmail(email);
		if (user) {
			// check for user record
			const modelView = vm.buildFullUserVm(user);
			// user is found.
			if (modelView.suspended) {
				// check if account is suspended
				return {
					status: 500,
					message:
						"Authentication failed! Account suspended. Contact the Admin or you write us at " +
						appSetting.all.support.email
				};
			}
			// compare password
			const loginState = await utility.comparePassword(
				password,
				user.passwordHash
			);
			if (loginState) {
				try {
					// generate token
					const token = await jwt.sign(
						{
							email: modelView.email,
							name: modelView.name,
							walletId: modelView.walletId,
							id: modelView.id
						},
						config.mongoDb.key
					);

					// check if user wants to be notified on login
					if (modelView.option.notifyOnLogin) {
						await notify.sendNotification(
							modelView.id,
							"You've logged into your account.",
							notifyType.success,
							"Account Login"
						);
					}
					return {
						status: 200,
						message: "Authentication Succeeded",
						user: modelView,
						token: token
					};
				} catch (error) {
					return {
						status: 500,
						message: error.message
					};
				}
			}
		}
		return {
			status: 500,
			message: "Authentication Failed! Incorrect Email or password."
		};
	},
	/**
	 * Get single user's account using email address
	 * @param  {String} email User's valid email address
	 */
	async getUserByEmail(email) {
		const model = await User.findOne({ email, removed: false })
			.populate(["plan.plan"])
			.exec();
		if (model) {
			return model;
		}
		// return vm.buildFullUserVm(user);
		throw new Error("Record not found!");
	},

	/**
	 * Check if user with given email address or id exist
	 * @param  {string} id user's id or email address
	 */
	async doesUserExist(id) {
		const state = await User.countDocuments({
			$or: [{ _id: id }, { email: id }]
		}).exec();
		return state > 0;
	},
	/**
	 * Get list user's referrals
	 * @param  {string} user user's id
	 * @param  {number} page page number
	 * @param  {number} limit total record to retrieve per page
	 */
	async getUserReferral(user, page, limit) {
		const query = { $and: [{ removed: false }, { referrer: user }] };
		// console.log(JSON.stringify(query, null, 5));
		const option = {
			populate: ["plan.plan"],
			limit: limit || 25,
			page: page || 1,
			sort: { dateCreated: -1 }
		};
		const result = await User.paginate(query, option);
		return {
			status: 200,
			message: "Completed!",
			docs: result.docs.map(u => vm.buildFullUserVm(u)),
			total: result.total,
			limit: result.limit,
			pages: result.pages,
			page: result.page
		};
	},
	/**
	 * Remove user's account with a given id
	 * @param {string} id user's id
	 */
	async removeAccount(id) {
		try {
			const status = await User.updateOne(
				{ _id: id },
				{
					$set: { removed: true },
					$currentDate: { lastModified: true }
				}
			).exec();
			if (status.ok > 0) {
				return {
					status: 200,
					message: "Account removed suucessfully"
				};
			} else {
				return {
					status: 500,
					message: "Failed! Unable to remove account, try again later."
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error.message
			};
		}
	},
	/**
	 * Verifies user's account
	 * @param {string} id user's id
	 */
	async verifyAccount(id) {
		//validation
		if (ObjectId.isValid(id)) {
			const status = await User.updateOne(
				{ _id: id },
				{
					$set: { accountVerified: true },
					$currentDate: { lastModified: true }
				}
			).exec();
			if (status.ok > 0) {
				// notification
				await notify.sendNotification(
					id,
					"Your account have been verified.",
					notifyType.success,
					"Account Verification"
				);
				return {
					status: 200,
					message: "Account verified suucessfully"
				};
			}
		}
		return {
			status: 500,
			message: "Failed! Unable to verify account, try again later."
		};
	},

	/**
	 * Get list of users using their email address
	 * @param {stirng} email user's email address
	 */
	async searchUser(email) {
		// Query
		const query = { $and: [{ removed: false }, { email: email }] };

		const option = {
			populate: ["plan.plan"],
			sort: { dateCreated: -1 }
		};

		const result = await User.paginate(query, option);
		// console.log(JSON.stringify(result, null, 6));
		return {
			status: 200,
			message: "Completed!",
			docs: result.docs.map(u => vm.buildFullUserVm(u)),
			total: result.total,
			limit: result.limit,
			pages: result.pages,
			page: result.page
		};
	},
	async CountAllUser() {
		const count = await User.countDocuments({ removed: false }).exec();
		return count;
	},

	/**
	 * Send password reset link
	 * @param {string} email user email address
	 */
	async SendPasswordReset(email) {
		// get user object
		const model = await this.getUserByEmail(email);
		if (model) {
			// call reset service
			const resetCb = await passwordResetService.NewPasswordRequest(
				email,
				utility.GetRandomCode()
			);
			//  create new ticket
			if (resetCb.status === 200) {
				// send mail
				mailingService.SendPasswordResetLink(
					model._id,
					model.name,
					email,
					resetCb.doc.code,
					resetCb.doc.id
				);
				resetCb.message =
					"Link containing a verification code has been sent your email addreess, check your inbox and spam folder respectively.";
				return resetCb;
			}
		}
		return {
			status: 500,
			message: `${email} is not connected to any account.`
		};
	},

	/**
	 * Update new password
	 * @param {string} id user id
	 * @param {string} newPassword new password
	 * @param {string} code activation code
	 * @param {string} restId password reset id
	 */
	async CompletePasswordReset(id, newPassword, code, restId) {
		// validation
		if (id && newPassword && code && restId) {
			// validate and update password reset code
			const state = await passwordResetService.CompleteReset(restId, code);
			if (state.status === 200) {
				// hash new password
				const hashed = await utility.hash(newPassword);
				// update user password
				const userModel = await User.findByIdAndUpdate(id, {
					$set: {
						passwordHash: hashed
					},
					$currentDate: { lastModified: true }
				}).exec();
				if (userModel) {
					return {
						status: 200,
						message: "Password updated successfully."
					};
				}
			}
		}
		return {
			status: 200,
			message: "Validation failed! Please enter valid code and password."
		};
	},

	/**
	 * Check if bitcoin address has been used.
	 * @param {string} address bitcoin address
	 */
	async DoesWalletAddressExists(address) {
		if (address) {
			const count = await User.countDocuments({
				bitcoinWalletAddress: address
			}).exec();
			return count > 0;
		}
	}
};
