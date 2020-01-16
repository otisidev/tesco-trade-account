class TransactionViewModel {
  // overloaded constructor
  constructor(model) {
    this.id = model._id;
    this.date = model.date;
    this.amount = model.amount;
    this.type = model.type;
    this.status = model.status;
    this.user = model.newUser;
    this.investmentId = model.investment;
    this.currency = model.currency;
  }
}

// make public
module.exports = TransactionViewModel;
