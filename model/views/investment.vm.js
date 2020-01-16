const uservm = require("../views/user.view.model");
class InvestmentViewModel {
	constructor(model) {
		this.investmentMade = model.investmentMade;
		this.currentBalance = model.currentBalance;
		this.id = model._id;
		this.currency = model.currency;
		this.user = new uservm(model.user);
		this.lastFund = model.lastModified;
		this.fundPayment = model.fundPaymentType
			? model.fundPaymentType.name
			: "";
		this.targetService = model.targetService;
		this.closed = model.close;
		this.percent = model.percent;
	}
}
module.exports = InvestmentViewModel;
