const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const investmentScheme = new mongoose.Schema({
	investmentMade: {
		type: Number,
		required: true
	},
	currentBalance: {
		type: Number,
		default: 0.0
	},
	removed: {
		type: Boolean,
		default: false
	},
	lastModified: Date,
	nextFund: Date,
	createdOn: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	close: {
		type: Boolean,
		default: false
	},
	currency: {
		type: Object,
		required: false
	},
	percent: {
		type: Number,
		required: true
	},
	fundPaymentType: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "FundPaymentType"
	},
	targetService: {
		type: String,
		required: true,
		trim: true
	}
});

// plugin
investmentScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("Investment", investmentScheme);
