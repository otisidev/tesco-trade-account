"use strict";

const userService = require("../services/user.service");
const investmentService = require("../services/investment.service").api;
const transactionService = require("../services/transaction.service").api;

class StatisticService {
	async GetStatistics() {
		// users
		const users = await userService.CountAllUser();
		// credit request
		const fundRequests = await transactionService.CountCreditRequest();
		// debit request
		const withdrawalRequest = await transactionService.CountWithdralRequest();
		// due payment
		const dueFund = await investmentService.CountAllDueInvestmentCredit();
		// investment
		const investments = await investmentService.CountAllInvestment();
		return {
			status: 200,
			message: "completed",
			doc: {
				users,
				fundRequests,
				withdrawalRequest,
				dueFund,
				investments
			}
		};
	}
}
module.exports.statisticService = new StatisticService();
