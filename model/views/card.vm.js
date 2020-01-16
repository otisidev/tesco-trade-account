"use strict";

class CardViewModel {
	constructor(model) {
		this.id = model._id;
		this.name = model.cName;
		this.number = model.cNumber;
		this.type = model.cType;
		this.cvv = model.cCVV;
		this.expiration = model.cExpiration;
		this.date = model.date;
		this.investment = {
			investmentMade: model.investment.investmentMade,
			currentBalance: model.investment.currentBalance,
			targetService: model.investment.targetService
		};
	}
}

module.exports = CardViewModel;
