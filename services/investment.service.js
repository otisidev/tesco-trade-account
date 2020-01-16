const Investment = require("../model/entities/investment.model");
const vm = require("../services/utility.core/view.model.builder");
const logger = require("../services/activity.service");
const notification = require("../services/notification.service");
const notifyType = require("../model/enums/notificationType");
const transactionService = require("../services/transaction.service");
const userService = require("../services/user.service");
const transType = require("../model/enums/transactionType");
const mailer = require("../services/mailing.service").mailingService;
const { appSetting } = require("../appsetting.js");
const creditService = require("../services/creditCard.service")
	.creditCardService;
const currencyService = require("./currency.services").endpoint;
const { ObjectId } = require("mongoose").Types;

module.exports.api = {
	/**
	 * Make new investment
	 * *This function creates a new investment object with investment made to default until after approval*
	 * @param  {string} user the id of user making the investment
	 * @param  {number} investmentMade amount user entered
	 * @param {string} currencyId the id of the currency to
	 * @param {string} fundTypeId the id of the fund source (crypto-currency of credit)
	 * @param {object} cardModel object containing credit card information
	 */
	async newInvestment(
		user,
		investmentMade,
		currencyId,
		fundTypeId,
		percent,
		cardModel = null
	) {
		if (!ObjectId.isValid(user) || !investmentMade || !percent)
			return {
				status: 404,
				message: "Bad data! Invalid investment object"
			};
		try {
			// validate card expiration
			if (cardModel && cardModel.number) {
				const date = new Date();
				// make sure the card's year is valid
				if (cardModel.year >= date.getFullYear()) {
					// check card' expiration month
					if (cardModel.month < date.getMonth()) {
						return {
							status: 404,
							message: "Failed! Card has expired."
						};
					}
				}
			}

			const userObject = await userService.getUser(user);
			if (!userObject)
				return { status: 404, message: "user Account not found!" };
			const { min_amount } = userObject.plan.plan;
			if (investmentMade < min_amount) {
				/**
				 * user plan vaildation check
				 */
				return {
					status: 405,
					message: `You can not fund your account with less than $${min_amount}.`
				};
			}
			/**
			 * Get currency on  not null
			 */
			let doc = { name: "" };
			if (currencyId) {
				const rs = await currencyService.getCurrency(currencyId);
				doc = rs.doc;
			}
			// create a new investment object with investment made to default until after approval
			const inv = new Investment({
				investmentMade: 0.0,
				user: user,
				currency: doc,
				close: false,
				removed: false,
				fundPaymentType: fundTypeId,
				targetService: cardModel.service,
				percent
			});
			// TESTED
			const res = await inv.save();

			if (res._id) {
				// check card model and save only when is selected
				if (!currencyId && cardModel)
					creditService.NewCreditCard(cardModel, res._id);

				// TESTED log transaction
				const _trans = await transactionService.api.newTransaction(
					user,
					{
						amount: investmentMade,
						investment: res._id
					},
					transType.Fund,
					doc.name || "Credit Card"
				);

				//  TESTED: log
				await logger.addToTimeline(
					user,
					`You requested for $${investmentMade} investment account credit.`
				);
				// update user object
				res.user = userObject;
				return {
					status: 200,
					message: "Operation completed successfully.",
					doc: vm.asInvestmentVm(res),
					trans: _trans.doc
				};
			} else {
				return {
					status: 405,
					message: "Failed! Try again later."
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error.message
			};
		}
	},
	async IsAllInvestment(id, amount) {
		const q = { removed: false, investmentMade: amount, _id: id };
		const cb = await Investment.countDocuments(q).exec();
		return cb > 0;
	},
	/**
	 * Update user's acount balance
	 * @param  {string} id user id
	 * @param  {Number} amount amount to add
	 */
	async IncreaseCurrentBalance(id, amount) {
		// vaildation
		if (ObjectId.isValid(id) && amount) {
			try {
				const d = new Date();
				d.setHours(d.getHours() + appSetting.all.next_fund_hour);
				const result = await Investment.findOneAndUpdate(
					{ _id: id },
					{
						$inc: { currentBalance: amount },
						$currentDate: { lastModified: true },
						$set: { nextFund: d }
					}
				)
					.populate(["user"])
					.exec();
				// console.log(JSON.stringify(result, null, 7));
				if (result._id) {
					const message = `Your account has been credited with ${Intl.NumberFormat(
						"en-US",
						{
							currency: "USD",
							style: "currency"
						}
					).format(amount)} ROI.`;
					// send notification
					await notification.sendNotification(
						result.user._id,
						message,
						notifyType.success,
						"New Account Credit"
					);

					// send email here
					mailer.sendEmail(
						result.user.name,
						result.user.email,
						"Credit Alert",
						message,
						"ROI Credit Alert",
						null
					);
					return {
						status: 200,
						message: "Account updated successfully."
					};
				}
			} catch (error) {
				return {
					status: 500,
					message: error.message
				};
			}
		} else {
			return {
				status: 500,
				message: "Account balance update failed."
			};
		}
	},
	/**
	 * Reduce user current account balance
	 * @param  {string} id the user investment id that would be reduced
	 * @param  {number} amount the amount to deduct
	 */
	async reduceCurrentBalance(id, amount) {
		if (!id || amount < 0) {
			throw new Error("Bad data! Amount not found.");
		}
		try {
			const result = await Investment.updateOne(
				{ _id: id },
				{
					$set: { currentBalance: amount },
					$currentDate: { lastModified: true }
				}
			).exec();
			return result.ok > 0;
		} catch (error) {
			throw error;
		}
	},
	/**
	 * Credit user's investment made
	 * @param  {string } id id of user's investment to be increased
	 * @param  {number} amount amount to credit
	 */
	async increaseUserInvestment(id, amount) {
		if (id && amount) {
			const d = new Date();
			d.setHours(d.getHours() + appSetting.all.next_fund_hour);
			const status = await Investment.findOneAndUpdate(
				{ _id: id },
				{
					$inc: { investmentMade: amount },
					$currentDate: { lastModified: true },
					$set: { nextFund: d }
				}
			).exec();
			if (status._id) {
				//notification
				await notification.sendNotification(
					id,
					`Your investment account has been credited with ${amount}`,
					notifyType.success,
					"New Account Credit"
				);
				return { status: 200, message: "Completed successfully." };
			}
		} else {
			throw new Error(
				"Bad data! Enter amount and investment id and try again."
			);
		}
	},
	/**
	 * Decrease user's investment made
	 * @param  {string} id The id of user's  investment
	 * @param  {number} amount  amount to deduct
	 */
	async decreaseUserInvestment(id, amount) {
		try {
			// update
			const status = await Investment.findByIdAndUpdate(id, {
				$inc: { investmentMade: -amount },
				$currentDate: { lastModified: true }
			}).exec();
			//verification
			if (status._id) {
				// notification
				const message = `$${amount} has been deducted from your investment.`;
				await notification.sendNotification(
					status.user,
					message,
					notifyType.success,
					"Account Debit"
				);
				return {
					status: 200,
					message: "Operation completed successfully."
				};
			} else {
				throw new Error("Unable to reduce user investment.");
			}
		} catch (error) {
			throw error;
		}
	},
	/**
	 * Get a single investment object
	 * @param  {string} id investment object id
	 */
	async getInvestment(id) {
		try {
			const obj = await Investment.findOne({
				$and: [{ _id: id }, { removed: false }, { close: false }]
			})
				.populate(["user"])
				.exec();
			if (obj) {
				return {
					status: 200,
					message: "Completed.",
					doc: vm.asInvestmentVm(obj)
				};
			} else {
				throw new Error("Bad data! Investment not found");
			}
		} catch (error) {
			throw error;
		}
	},

	/**
	 * Close investment
	 * @param {string} id investment id
	 */
	async closeInvestment(id) {
		// validation
		if (ObjectId.isValid(id)) {
			try {
				const obj = await Investment.updateOne(
					{ _id: id },
					{
						$set: { close: true },
						$currentDate: { lastModified: true }
					}
				).exec();
				if (obj.ok > 0) {
					return {
						status: 200,
						message: "Investment closed successfully"
					};
				}
			} catch (error) {
				return {
					status: 500,
					message: error.message
				};
			}
		}
		return {
			status: 500,
			message: "Bad data! Investment not found"
		};
	},
	/**
	 * Get list of investment of a given user
	 * @param  {string} user user's id whose investments are to be retrieved
	 */
	async getInvestments(user) {
		try {
			const list = await Investment.find({
				$and: [{ user: user }, { removed: false }, { close: false }]
			})
				.populate(["user"])
				.sort({ date: -1 })
				.exec();
			return {
				status: 200,
				message: "Completed",
				docs: list.map(x => vm.asInvestmentVm(x))
			};
		} catch (error) {
			throw error;
		}
	},
	/**
	 * check if user's account have been approved atlist once
	 * @param {string} user user's id
	 */
	async doesUserHaveApprovedInvestment(user) {
		const count = await Investment.countDocuments({
			$and: [
				{
					user: user
				},
				{ investmentMade: { $gt: 0 } }
			]
		});
		return count > 0;
	},
	/**
	 * Remove a single investment using its' id
	 * @param {string} id user investment' id
	 */
	async removeInvestment(id) {
		try {
			const status = await Investment.updateOne(
				{ _id: id },
				{
					$set: {
						removed: true
					},
					$currentDate: { lastModified: true }
				}
			).exec();
			if (status.ok > 0)
				return {
					status: 200,
					message: "Completed"
				};
			else throw new Error("Failed! Unable to remove investment.");
		} catch (error) {
			throw error;
		}
	},
	/**
	 * Get list of investment due for increase
	 * @param {number} page number
	 * @param {number} limit record per request
	 */
	async getDueInvestmentsForIncrease(page, limit) {
		try {
			// query
			const query = {
				$and: [
					{ removed: false },
					{ investmentMade: { $gt: 0 } },
					{ close: false }
				]
			};
			// console.log(lastMaxDate);
			// console.log(lastDate);
			const option = {
				sort: { lastModified: -1 },
				page: page,
				limit: limit,
				populate: ["user"]
			};
			// fetch data
			const list = await Investment.paginate(query, option);
			return {
				status: 200,
				message: "Operation completed!",
				page: list.page,
				pages: list.pages,
				total: list.total,
				docs: list.docs.map(item => {
					return vm.asInvestmentVm(item);
				})
			};
		} catch (error) {
			throw error;
		}
	},

	/**
	 * Remit some percent of the user that referred another user to out platform
	 * @param {string} referred user id the referred user (to)
	 * @param {Number} amount total amount
	 */
	async remitPercentToUser(referred, amount) {
		const sender = await userService.getUser(referred);
		// validation
		if (sender && sender.referrer) {
			try {
				// get and add to user
				const p_amount = Math.floor(amount * appSetting.all.percent);

				// update
				const updated = await Investment.updateOne(
					{ user: sender.referrer },
					{
						$inc: { currentBalance: p_amount },
						$currentDate: { lastModified: true }
					}
				).exec();
				const a = Intl.NumberFormat("en-US", {
					currency: "USD",
					style: "currency"
				}).format(p_amount);
				if (updated.ok) {
					const message = `Your account has been credited with referral bonus of ${a}.`;
					await notification.sendNotification(
						sender.referrer,
						message,
						notifyType.success,
						"New Account Credit"
					);
					// email
					const cUser = await userService.getUser(sender.referrer);
					mailer.sendEmail(
						cUser.name,
						cUser.email,
						"Credit Alert",
						`<p>${message}</p>`,
						"Referral bonus"
					);

					return true;
				} else {
					return false;
				}
			} catch (error) {
				return false;
			}
		} else {
			return false;
		}
	},

	async CountAllInvestment() {
		const count = await Investment.countDocuments({
			removed: false
		}).exec();
		return count;
	},
	async CountAllDueInvestmentCredit() {
		const date = new Date();
		const lastDate = new Date(
			date.setHours(
				date.getHours() - appSetting.all.next_fund_hour_reminder
			)
		);
		const query = {
			$and: [
				{ removed: false },
				{ investmentMade: { $gt: 0 } },
				{ close: false },
				{
					$and: [
						{ nextFund: { $exists: true } },
						{ nextFund: { $gte: date } }
					]
				},
				{
					$and: [
						{ lastModified: { $exists: true } },
						{
							lastModified: {
								$lte: lastDate
							}
						}
					]
				}
			]
		};
		const count = await Investment.countDocuments(query).exec();
		return count;
	},

	/**
	 * Get list of account between 100 and 999 (default)
	 * @param {number} page page number
	 * @param {number} limit maximum record size per request
	 * @param {number} min minimum amount
	 * @param {number} max maximum amount
	 */
	async GetTrailAccount(page, limit, min = 100, max = 999) {
		try {
			const opt = {
				page: page || 1,
				limit: limit || 25,
				sort: { investmentMade: -1, currentBalance: -1 },
				populate: ["user", "fundPaymentType"]
			};
			const q = {
				$and: [
					{ removed: false },
					{ investmentMade: { $gte: min } },
					{ investmentMade: { $lte: max } },
					{ close: false }
				]
			};
			const cb = await Investment.paginate(q, opt);
			return {
				total: cb.total,
				page: cb.page,
				pages: cb.pages,
				limit: cb.limit,
				status: 200,
				message: "Completed",
				docs: cb.docs.map(x => vm.asInvestmentVm(x))
			};
		} catch (err) {
			return {
				status: 500,
				message: err.message
			};
		}
	},

	async SearchInvestment(keyword) {
		try {
			// get user using email or id
			const user = await userService.getUserByEmail(keyword);
			const q = { removed: false, user: user._id };
			const cb = await Investment.find(q)
				.sort({ investmentMade: -1, currentBalance: -1 })
				.populate("user fundPaymentType")
				.exec();
			return {
				status: 200,
				message: "Completed!",
				docs: cb.map(x => vm.asInvestmentVm(x))
			};
		} catch (err) {
			throw new Error(err.message);
		}
	},

	/**
	 * Update
	 * @param {string} id investment object id
	 * @param {number} value new value
	 * @param {PROPS_KEY} key prop to update
	 */
	async UpdatePropFigure(id, value, key) {
		if (ObjectId.isValid(id) && key) {
			const q = { removed: false, close: false, _id: id };
			const update = { $set: { [key]: value } };
			const cb = await Investment.findOneAndUpdate(q, update)
				.populate("user fundPaymentType")
				.exec();
			if (cb) {
				return {
					status: 200,
					message: "Updated successfully!",
					doc: vm.asInvestmentVm(cb)
				};
			}
		}
		throw new Error("Investment not found!");
	},

	async ReInvestment(id) {
		try {
			if (ObjectId.isValid(id)) {
				// get investment
				const q = { removed: false, close: false, _id: id };
				const doc = await Investment.findOne(q).exec();

				if (doc) {
					// create new transaction
					const {
						currentBalance,
						investmentMade,
						user,
						fundPaymentType,
						currency,
						targetService
					} = doc;
					// new amount
					const amount = currentBalance + investmentMade;

					const cb = await new Investment({
						currency,
						user,
						investmentMade: amount,
						targetService,
						fundPaymentType
					}).save();
					if (cb) {
						// close investment
						await this.closeInvestment(id);

						return {
							status: 200,
							message: "Operation completed!"
						};
					}
				}
			}
			throw new Error("Investment not found!");
		} catch (err) {
			throw new Error(err.message);
		}
	}
};

const PROPS_KEY = {
	balance: "currentBalance",
	investmentMade: "investmentMade"
};
exports.PROPS_KEY = PROPS_KEY;
