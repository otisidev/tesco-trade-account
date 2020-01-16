"use strict";

const UserModel = require("../../model/views/user.view.model");
const NotifyModel = require("../../model/views/notification.view.model");
const PlanViewModel = require("../../model/views/plan.view");
const TransactionModel = require("../../model/views/transaction.vm");
const InvestmentModel = require("../../model/views/investment.vm");
const CurrencyViewModel = require("../../model/views/currency.vm");
const CardViewModel = require("../../model/views/card.vm");

module.exports = {
	buildFullUserVm(model) {
		return new UserModel(model);
	},
	asTimelineVm(timeline) {
		return {
			id: timeline._id,
			phrase: timeline.phrase,
			date: timeline.date
		};
	},
	asNotificationVm(model) {
		return new NotifyModel(model);
	},
	/** Build a new investment plan model
	 * @param  {object} model Investment plan object
	 */
	asPlanVm(model) {
		return new PlanViewModel(model);
	},
	/**
	 * Build new TransactionModel
	 * @param  {Object} model Transaction object
	 */
	asTransactionModel(model) {
		if (model.user) model.newUser = this.buildFullUserVm(model.user);
		model.user = {};
		return new TransactionModel(model);
	},
	asInvestmentVm(model) {
		return new InvestmentModel(model);
	},
	asCurrencyVm(model) {
		return new CurrencyViewModel(model);
	},
	asCardVm(model) {
		return new CardViewModel(model);
	}
};
