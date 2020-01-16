"use strict";
const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const fundPaymentType = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	lastModified: Date,
	removed: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

// plugin
fundPaymentType.plugin(mongoose_pagination);
module.exports = mongoose.model("FundPaymentType", fundPaymentType);
