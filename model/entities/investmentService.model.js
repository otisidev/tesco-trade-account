"use strict";
const mongoose = require("mongoose");
const paginate = require("mongoose-paginate");

const ServiceModel = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	lastModified: Date
});
// export public
ServiceModel.plugin(paginate);
module.exports = mongoose.model("InvestmentService", ServiceModel);
