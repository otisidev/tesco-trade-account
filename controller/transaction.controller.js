const services = require("../services/transaction.service");
const tType = require("../model/enums/transactionType");
const appSettingService = require("../appsetting").appSetting;

module.exports = {
	// new account fund request
	// funding a particular investment
	fundAccountRequest: async (req, res) => {
		const { amount, id } = req.body;
		const user = req.currentUser.id;
		const cb = await services.api.newTransaction(
			user,
			{ amount: amount, investment: id },
			tType.Fund
		);
		return res.json(cb);
	},
	// new account withdraw request
	accountWithdrawRequest: async (req, res) => {
		const { amount, id, currency } = req.body;
		const cb = await services.api.newTransaction(
			req.currentUser.id,
			{ amount: amount, investment: id },
			tType.Withdraw,
			currency
		);
		return res.json(cb);
	},
	// approve fund resquest
	approveFundRequest: async (req, res) => {
		const { id, addedBy } = req.body;
		const cb = await services.api.approveTransaction(
			req.currentUser.id,
			addedBy,
			id,
			tType.Fund
		);
		return res.json(cb);
	},

	// approve fund withdrawal
	approveWithdrawRequest: async (req, res) => {
		const { id, addedBy } = req.body;
		const cb = await services.api.approveTransaction(
			req.currentUser.id,
			addedBy,
			id,
			tType.Withdraw
		);
		return res.json(cb);
	},

	// cancel request
	cancelTransaction: async (req, res) => {
		const { id } = req.body || req.params;
		// perform operation
		const cb = await services.api.cancelTransaction(req.currentUser.id, id);
		return res.json(cb);
	},
	// cancel request
	reviewTransaction: async (req, res) => {
		const { id } = req.body || req.params;
		// perform operation
		const cb = await services.api.reviewTransaction(id);
		return res.json(cb);
	},
	// get list of transaction by user
	getUserTransaction: async (req, res) => {
		const page = parseInt(req.query.page); // page number
		const limit = parseInt(req.query.limit); // page size
		const arr = await services.api.getTransaction(req.params.id, page, limit);
		return res.json(arr);
	},
	// get pending request
	getPendingFundRequest: async (req, res) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const cb = await services.api.getPendingTransaction(
			tType.Fund,
			page,
			limit
		);
		return res.json(cb);
	},
	// get pending withdrawal request
	getPendingWithdrawalRequest: async (req, res) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const cb = await services.api.getPendingTransaction(
			tType.Withdraw,
			page,
			limit
		);
		return res.json(cb);
	},
	// get pending withdrawal request
	newFundTransaction: async (req, res) => {
		const { model, currency } = req.body;
		const cb = await services.api.newTransaction(
			req.currentUser.id,
			model,
			tType.Fund,
			currency
		);
		return res.json(cb);
	}
};

module.exports.appSetting = {
	// application setting and data
	GetApplicationSetting: async (req, res) => {
		const cb = await appSettingService.GetConfig();
		return res.json({
			status: 200,
			message: "completed",
			doc: {
				data: {
					transactions: cb.data.daily_transaction,
					investors: cb.data.active_investor,
					consultants: cb.data.consultant,
					investments: cb.data.total_investment
				},
				setting: {
					name: cb.app_name,
					validateEmail: cb.validateEmail,
					validateWallet: cb.validateWalletAddress,
					next_fund_hour: cb.next_fund_hour,
					next_fund_hour_reminder: cb.next_fund_hour_reminder,
					percent: cb.percent
				}
			}
		});
	},
	UpdateData: async (req, res) => {
		const cb = await appSettingService.UpdateData(req.body);
		return res.json(cb);
	},
	UpdateSetting: async (req, res) => {
		const cb = await appSettingService.Update(req.body);
		return res.json(cb);
	}
};
