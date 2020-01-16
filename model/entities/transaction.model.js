const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const transactionScheme = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	amount: {
		type: Number,
		required: true
	},
	type: {
		type: Number,
		required: true
	},
	status: {
		type: Number,
		default: 2
	},
	investment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Investment",
		required: true
	},
	lastModified: Date,
	currency: {
		type: String,
		required: true
	}
});

// plugin
transactionScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("Transaction", transactionScheme);
