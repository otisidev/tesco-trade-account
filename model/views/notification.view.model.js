class NotificationModel {
	constructor(model) {
		this.id = model._id;
		this.date = model.date;
		this.message = model.message;
		this.seen = model.seen;
		this.type = model.type;
		this.heading = model.heading;
	}
}

module.exports = NotificationModel;
