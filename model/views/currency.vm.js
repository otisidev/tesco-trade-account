class CurrencyViewModel {
  constructor(model) {
    this.name = model.name;
    this.address = model.address;
    this.id = model._id;
    this.icon = model.icon;
  }
}
module.exports = CurrencyViewModel;
