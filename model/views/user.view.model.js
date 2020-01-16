"use strict";

class UserViewModel {
	constructor(model) {
		if (model) {
			this.id = model._id;
			this.name = model.name;
			this.email = model.email;
			this.address = model.address;
			this.city = model.city;
			this.zipcode = model.zipCode;
			this.admin = model.isAdmin;
			this.walletId = model.bitcoinWalletAddress;
			this.suspended = model.suspended;
			this.verified = model.accountVerified;
			this.joined = model.dateCreated;
			this.plan = model.plan.plan && model.plan.plan.title;
			this.option = model.option;
			this.referrer = model.referrer;
		}
	}
}

// make class public
module.exports = UserViewModel;
