"use strict";
const US = require("../services/user.service");
const utility = require("../services/utility.core/utility");
const vm = require("../services/utility.core/view.model.builder");
const timelineService = require("../services/activity.service");
const transService = require("../services/transaction.service");
const MS = require("../services/mailing.service").mailingService;

// new user
module.exports = {
	// new user
	newUser: async (req, res) => {
		try {
			// get user model from req body
			const user = req.body;
			const referrer = req.body.ref || req.query.ref;

			// validate email
			// hash password
			const pwd = await utility.hash(user.password);

			if (pwd) {
				// add user
				user.password = pwd;
				const account = await US.addUser(user, referrer);
				if (account.status === 200) {
					// send mail
					MS.sendConfirmEmail(
						account.doc._id,
						account.doc.email,
						account.doc.name
					);
					// return new user object
					return res.json({
						status: 200,
						message: account.message,
						doc: vm.buildFullUserVm(account.doc)
					});
				} else {
					return res.json(account);
				}
			}
			return res.json({
				status: 404,
				message:
					"Unable to create new account! Confirm all properties and try again."
			});
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	},

	// get users
	getUsers: async (req, res) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const cb = await US.getUsers(page, limit);
		return res.json(cb);
	},
	// get single user
	getSingleUser: async (req, res) => {
		const cb = await US.getUser(req.params.id);
		return res.json({
			status: 200,
			message: "user found.",
			doc: vm.buildFullUserVm(cb)
		});
	},

	// make admin
	makeUserAdmin: async (req, res) => {
		const state = await US.toggleUserAdminRights(req.params.id, true);
		if (state) {
			return res.status(200).json({
				status: 200,
				message: "Admin rights has been granted."
			});
		} else {
			return res.status(200).json({
				status: 500,
				message: "An error occured! check and try again."
			});
		}
	},
	// remove admin
	removeUserAdminRight: async (req, res) => {
		const state = await US.toggleUserAdminRights(req.params.id, false);
		if (state) {
			return res.status(200).json({
				status: 200,
				message: "Admin rights has been lifted"
			});
		} else {
			return res.json({
				status: 500,
				message: "An error occured! check and try again."
			});
		}
	},

	// suspend user's account
	suspendAccount: async (req, res) => {
		try {
			const state = await US.toggleAccountSuspension(req.params.id, true);
			if (state) {
				return res.json({
					status: 200,
					message: "Account has been suspended."
				});
			} else {
				return res.json({
					status: 500,
					message: "An error occured! check and try again."
				});
			}
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	},
	// resolve suspened user's account
	resolveAccountSuspension: async (req, res) => {
		const state = await US.toggleAccountSuspension(req.params.id, false);
		if (state) {
			return res.json({
				status: 200,
				message: "Account suspension has been resolved."
			});
		} else {
			return res.json({
				status: 500,
				message: "An error occured! check and try again."
			});
		}
	},

	// user activity
	getUserRecentActitvities: async (req, res) => {
		const cb = await timelineService.getTimeline(req.params.id, 1, 10);
		return res.json(cb);
	},

	// user login
	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			// validate
			const user = await US.getUserByEmail(email);
			if (user) {
				//login here
				const cb = await US.login(email, password);
				return res.json(cb);
			} else {
				return res.json({
					status: 404,
					message: "Authentication failed! Unknown user."
				});
			}
		} catch (err) {
			return res.json({
				status: 500,
				message: "Authentication failed! Unknown user."
			});
		}
	},

	// set plan
	setPlan: async (req, res) => {
		try {
			const { userid, planid } = req.body;
			const cb = await US.subscribToPlan(userid, planid);
			return res.json(cb);
		} catch (error) {
			return res.json({
				status: 500,
				message: error.message || "Authentication failed! Unknown user."
			});
		}
	},

	// credit user's account
	increaseAccount: async (req, res) => {
		try {
			const { amount, id } = req.body;
			const cb = await US.increaseAccountBalance(id, amount);
			return res.json(cb);
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message || "Authentication failed! Unknown user."
			});
		}
	},

	//  update Profile
	updateAccountProfile: async (req, res) => {
		try {
			const cb = await US.updateAccount(req.currentUser.id, req.body);
			if (cb)
				return res.json({
					status: 200,
					message: "Profile updated successfully."
				});
			else
				return res.json({
					status: 500,
					message: "Failed! Unable to update profile."
				});
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	},

	// get user's referrals
	getReferral: async (req, res) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const cb = await US.getUserReferral(req.params.id, page, limit);
		return res.json(cb);
	},

	// remove an account
	removeAccount: async (req, res) => {
		try {
			// remove
			const cb = await US.removeAccount(req.params.id);
			return res.json(cb);
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	},

	// check user's referrer's payment status
	checkReferrerStatus: async (req, res) => {
		const cb = await transService.api.getUserFirstTransaction(req.params.id);
		return res.json(cb);
	},

	// send email to user
	sendMail: async (req, res) => {
		const { email, id, name } = req.body;
		if (email && id && name) {
			const cb = await MS.sendConfirmEmail(id, email, name);
			return res.json(cb);
		}
		return res.json({
			status: 500,
			message: "Email address not found!"
		});
	},

	// send email to user
	sendContactMail: async (req, res) => {
		const { email, subject, name, body, user } = req.body;
		if (email && subject && name && body) {
			const cb = await MS.sendEmail(name, email, subject, body, user);
			return res.json(cb);
		}
		return res.json({
			status: 500,
			message: "Email address not found!"
		});
	},

	// verify account
	verifyAccount: async (req, res) => {
		try {
			const cb = await US.verifyAccount(req.params.id);
			return res.json(cb);
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	},

	// search user using emaill address
	searchUserByEmail: async (req, res) => {
		try {
			const cb = await US.searchUser(req.query.email);
			return res.json(cb);
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	},

	sendPasswordResetEmail: async (req, res) => {
		try {
			const email = req.body["email"] || "";
			const cb = await US.SendPasswordReset(email);
			return res.json(cb);
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	},

	newPassword: async (req, res) => {
		try {
			const { id, password, code, resetId } = req.body;
			const cb = await US.CompletePasswordReset(id, password, code, resetId);
			return res.json(cb);
		} catch (err) {
			return res.json({
				status: 500,
				message: err.message
			});
		}
	}
};
