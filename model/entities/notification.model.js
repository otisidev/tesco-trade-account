const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const notificationScheme = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	message: {
		type: String,
		required: true
	},
	seen: {
		type: Boolean,
		default: false
	},
	type: {
		type: Number,
		default: 2
	},
	removed: {
		type: Boolean,
		default: false
	},
	heading: String
});

// plugin
notificationScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("Notification", notificationScheme);
