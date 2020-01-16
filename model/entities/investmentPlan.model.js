const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const investmentplanScheme = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	percent: {
		type: Number,
		required: true
	},
	description: String,
	minAmount: {
		type: Number,
		required: true
	},
	maxAmount: {
		type: Number,
		required: true
	},
	lastModified: Date,
	removed: {
		type: Boolean,
		default: false
	},
	service: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "InvestmentService",
		required: false
	}
});

// plugin
investmentplanScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("InvestmentPlan", investmentplanScheme);
