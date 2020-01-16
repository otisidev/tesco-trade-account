const Transaction = require("../model/entities/transaction.model");
const vm = require("../services/utility.core/view.model.builder");
const userService = require("../services/user.service");
const tType = require("../model/enums/transactionType");
const logger = require("../services/activity.service");
const planService = require("../services/plan.service");
const TransStatus = require("../model/enums/transactionStatus");
const notifyService = require("../services/notification.service");
const notifyType = require("../model/enums/notificationType");
const investmentService = require("../services/investment.service");
const mailer = require("../services/mailing.service").mailingService;
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
// functions
module.exports.api = {
	// new
	/** Create new transaction record
	 * @param  {string} user The id of the user performing the operation
	 * @param  {Object} model transaction object
	 * @param {tType} type  type of transaction Fund|Withdraw
	 * @param {string} currency currency name
	 */
	async newTransaction(user, model, type, currency) {
		try {
			// validate
			if (ObjectId.isValid(user) && model.amount && model.investment) {
				// make sure the amount the greater or eqauls to the plan's amount
				const userObject = await userService.getUser(user);
				// make sure that user don't withdraw more than want they have
				const userInvestment = await investmentService.api.getInvestment(
					model.investment
				);

				const { min_amount } = userObject.plan.plan;
				if (type === tType.Fund) {
					if (!currency)
						return {
							message: "Bad data! Currency not found.",
							status: 500
						};
					// before checking for min amount, make user that it isn't first funding
					if (userInvestment.doc.investmentMade === 0) {
						// make sure user's don't fund less than the amount their subscribed for
						if (model.amount < min_amount)
							return {
								message: `You can not fund your account with less than $${min_amount}.`,
								status: 500
							};
					}
				} else {
					//

					if (model.amount > userInvestment.doc.currentBalance)
						return {
							message: `You can not withdraw more than $${
								userInvestment.doc.currentBalance
							}.`,
							status: 500
						};
				}

				//add new object here
				const trans = new Transaction({
					user: user,
					type: type,
					amount: model.amount,
					investment: model.investment,
					currency: currency
				});
				// console.log(JSON.stringify(trans, null, 6));
				// save new transaction
				const _cb = await trans.save();
				//log
				if (type === tType.Withdraw) {
					const message = `You requested for a withdrawal of $${model.amount}.`;
					await logger.addToTimeline(user, message);

					// send mail
					const _message = `You've made a withdrawal request with the following details: <br/>
                <b>Amount: </b> ${Intl.NumberFormat("en-US", {
									currency: "USD",
									style: "currency"
								}).format(model.amount)} <br/>
                <b>Currency: </b> ${currency} <br/>
                <b>Type: </b> Withdraw <br/><br/>
                Note: This email is intended for <b>${userObject.email}</b>
                `;
					mailer.sendEmail(
						userObject.name,
						userObject.email,
						"Withdraw Request",
						_message,
						"Account Withdrawal Request."
					);
				}
				return {
					status: 200,
					message: "Completed Successfully!",
					doc: _cb
				};
			} else {
				return {
					status: 404,
					message: "Invalid transaction object detected!"
				};
			}
		} catch (error) {
			return {
				status: 404,
				message: error.message
			};
		}
	},

	//get single user transaction
	/**
	 * Get list of transaction of a particular user
	 * @param  {string} user The id of the user whose transaction log is to be retrieved
	 * @param  {number} page Page number
	 * @param  {number} limit number of record to return per request
	 */
	async getTransaction(user, page, limit) {
		try {
			const option = {
				sort: { date: -1 },
				page: page || 1,
				limit: limit || 25,
				populate: ["user"]
			};
			const list = await Transaction.paginate({ user: user }, option);
			return {
				page: list.page,
				pages: list.pages,
				limit: list.limit,
				docs: list.docs.map(d => vm.asTransactionModel(d)),
				status: 200,
				message: "Completed!",
				total: list.total
			};
		} catch (error) {
			throw error;
		}
	},
	/**
	 * Get list of Transaction of a particular investment
	 * @param  {string} investmentId user investment id
	 * @param  {number} page page number
	 * @param  {number} limit number of record to return per request
	 */
	async getTransactionsByInvestment(investmentId, page, limit) {
		const option = {
			sort: { date: -1 },
			page: page || 1,
			limit: limit || 25,
			populate: ["user"]
		};
		const list = await Transaction.paginate(
			{ investment: investmentId },
			option
		);
		return {
			page: list.page,
			pages: list.pages,
			limit: list.limit,
			docs: list.docs.map(d => vm.asTransactionModel(d)),
			status: 200,
			message: "Completed!",
			total: list.total
		};
	},
	// cancel transaction
	/**
	 * Cancel single transaction using its id
	 * @param  {string} user The id  of user making the operation
	 * @param  {string} id The id of  the transaction to cancel
	 */
	async cancelTransaction(user, id) {
		if (!ObjectId.isValid(id) || !ObjectId.isValid(user)) {
			return {
				status: 404,
				message: "Bad data! Transaction not found."
			};
		}
		try {
			//   const isUser= await userService.doesUserExist(user)
			const result = await Transaction.findOneAndUpdate(
				{ _id: id },
				{
					$set: { status: TransStatus.cancelled },
					$currentDate: { lastModified: true }
				}
			).exec();
			if (result._id) {
				// check if this transaction is the only| first transaction its' investment
				const inve = await investmentService.api.getInvestment(
					result.investment
				);
				if (inve.doc.investmentMade < 1) {
					// cancel investment here
					await investmentService.api.removeInvestment(result.investment);
				}
				//log
				const message = `You cancelled transaction with transaction id ${id},`;
				await logger.addToTimeline(user, message);
				await notifyService.sendNotification(
					user,
					message,
					notifyType.failed,
					"Transaction cancelled"
				);
				return {
					status: 200,
					message: "Transaction completed successfully."
				};
			} else {
				return {
					status: 500,
					message: "Unable to complete operation! Try again later."
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error.message
			};
		}
	},

	// approve transaction
	/**
	 * Approve a single transaction
	 * @param  {string} user The id of user performing the operation
	 * @param  {string} id The id of transaction to approve
	 * @param {string} addedBy The id of user that created the transaction
	 * @param {tType} type Type of transaction Fund|Withdraw
	 */
	async approveTransaction(user, addedBy, id, type) {
		if (
			!ObjectId.isValid(id) ||
			!ObjectId.isValid(addedBy) ||
			!ObjectId.isValid(user)
		) {
			return {
				status: 500,
				message: "Bad data! transaction and user are required."
			};
		}
		try {
			// get transaction and first
			const singelTrans = await this.getSingleTransaction(id);
			if (singelTrans.doc.status === TransStatus.completed)
				return {
					status: 500,
					message: "Failed! Transaction cannot be approve more than once."
				};
			const _user = await userService.getUser(addedBy);
			// update current balance
			// get user's account balance
			const userInvestment = await investmentService.api.getInvestment(
				singelTrans.doc.investmentId
			);

			if (type === tType.Withdraw) {
				if (userInvestment.doc.currentBalance < singelTrans.doc.amount) {
					// cancel the transaction request
					await Transaction.updateOne(
						{ _id: id },
						{
							$set: { status: TransStatus.cancelled },
							$currentDate: { lastModified: true }
						}
					).exec();
					return {
						status: 500,
						message: "Failed! Insufficient fund, transaction cancelled"
					};
				} else {
					const amount =
						userInvestment.doc.currentBalance - singelTrans.doc.amount;
					await investmentService.api.reduceCurrentBalance(
						singelTrans.doc.investmentId,
						amount
					);
					const ss = await Transaction.updateOne(
						{ _id: id },
						{
							$set: { status: TransStatus.completed },
							$currentDate: { lastModified: true }
						}
					).exec();
					if (ss.ok < 1) {
						return {
							status: 500,
							message: "Failed! unable to approve transaction."
						};
					}
				}
			}

			// check if the investment plan for min and max
			if (type === tType.Fund) {
				const { max_amount } = _user.plan.plan;
				// check amount against current plan max amount
				if (singelTrans.doc.amount > max_amount) {
					// get a plan that suites the new amount
					const sPlan = await planService.getSinglePlanByAmount(
						singelTrans.doc.amount
					);
					// update user's plan
					await userService.subscribToPlan(addedBy, sPlan.id);
					notifyService.sendNotification(
						addedBy,
						"Your investment plan has been upgraded.",
						notifyType.success,
						"Plan Upgrade"
					);
				}
				// call user service to changes the current
				const status = await Transaction.findOneAndUpdate(
					{ _id: id },
					{
						$set: { status: TransStatus.completed },
						$currentDate: { lastModified: true }
					}
				).exec();
				if (!status)
					return {
						message: "Failed! unable to approve transaction.",
						status: 500
					};

				await investmentService.api.increaseUserInvestment(
					singelTrans.doc.investmentId,
					singelTrans.doc.amount
				);
				// remit 10% to referrer
				const { total } = await this.getTransaction(addedBy);
				// remit only on the first transaction
				if (total === 1) {
					await investmentService.api.remitPercentToUser(
						addedBy,
						singelTrans.doc.amount
					);
				}
			}

			// log
			await logger.addToTimeline(
				user,
				`You approved transaction with Id ${id}.`
			);

			// email user here
			const message = ` Your transaction with the following details has been verified and approved: <br/>
				<b>Amount: </b> ${Intl.NumberFormat("en-US", {
					currency: "USD",
					style: "currency"
				}).format(singelTrans.doc.amount)} <br/>
                <b>Currency: </b> ${singelTrans.doc.currency} <br/>
                <b>Type: </b> ${type === tType.Fund ? "Fund" : "Withdraw"}<br/>
            
`;
			mailer.sendEmail(
				_user.name,
				_user.email,
				"Payment Verified",
				message,
				"Transaction Approved!"
			);
			return {
				status: 200,
				message: "Transaction approved successfully!"
			};
		} catch (error) {
			return {
				status: 500,
				message: error.message
			};
		}
	},

	// get pending transaction
	/**
	 * Get list of pending transactions
	 * @param  {tType} type type of transaction to fetch
	 * @param  {number} page page number
	 * @param  {number} limit total record to return per request
	 */
	async getPendingTransaction(type, page = 1, limit = 25) {
		const option = {
			sort: { date: -1 },
			populate: ["user"],
			page: page,
			limit: limit
		};
		const query = {
			$and: [
				{
					$or: [
						{ status: TransStatus.inProcess },
						{ status: TransStatus.pending }
					]
				},
				{ type: type }
			]
		};
		const list = await Transaction.paginate(query, option);

		return {
			status: 200,
			message: "Completed",
			pages: list.pages,
			page: list.page,
			limit: list.limit,
			docs: list.docs.map(t => vm.asTransactionModel(t)),
			total: list.total
		};
	},
	/**
	 * Get single Transaction using it's id
	 * @param  {string} id transaction id
	 */
	async getSingleTransaction(id) {
		const res = await Transaction.findById(id)
			.populate(["user"])
			.exec();
		return {
			status: 200,
			message: "Completed",
			doc: vm.asTransactionModel(res)
		};
	},

	async reviewTransaction(id) {
		if (!ObjectId.isValid(id)) {
			return {
				status: 404,
				message: "Bad data! Transaction id not found."
			};
		}
		try {
			const result = await Transaction.updateOne(
				{
					$and: [
						{
							investment: id
						},
						{ status: TransStatus.pending }
					]
				},
				{
					$set: { status: TransStatus.inProcess },
					$currentDate: { lastModified: true }
				}
			).exec();
			if (result.ok > 0) {
				return {
					status: 200,
					message: "Transaction completed successfully."
				};
			} else {
				return {
					status: 500,
					message: "Unable to complete operation! Try again later."
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error.message || "Unable to complete operation!"
			};
		}
	},

	/**
	 *
	 * @param {string} user user id
	 */
	async getUserFirstTransaction(user) {
		const res = await Transaction.find({
			$and: [{ user: user }, { status: TransStatus.completed }]
		})
			.sort({ date: -1 })
			.populate(["user"])
			.exec();
		if (res.length > 0) {
			return {
				status: 200,
				message: "Completed",
				doc: vm.asTransactionModel(res[0])
			};
		} else {
			return {
				status: 500,
				message: "No payment yet!"
			};
		}
	},

	async CountCreditRequest() {
		const query = {
			$and: [
				{
					$or: [
						{ status: TransStatus.inProcess },
						{ status: TransStatus.pending }
					]
				},
				{ type: tType.Fund }
			]
		};
		const count = await Transaction.countDocuments(query).exec();
		return count;
	},
	async CountWithdralRequest() {
		const query = {
			$and: [
				{
					$or: [
						{ status: TransStatus.inProcess },
						{ status: TransStatus.pending }
					]
				},
				{ type: tType.Withdraw }
			]
		};
		const count = await Transaction.countDocuments(query).exec();
		return count;
	}
};
