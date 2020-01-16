class PlanViewModel {
	constructor(model) {
		this.id = model._id;
		this.title = model.title;
		this.percent = model.percent;
		this.description = model.description;
		this.min_amount = model.minAmount;
		this.max_amount = model.maxAmount;
		this.service = model.service.name && model.service.name;
	}
}
module.exports = PlanViewModel;
