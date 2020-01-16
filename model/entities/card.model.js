"use strict";

const mongoose = require("mongoose");
const paginate = require("mongoose-paginate");

const CardSchema = new mongoose.Schema({
	cName: {
		type: String,
		required: true
	},
	cNumber: {
		type: Number,
		required: true,
		unique: true,
		minlength: 16,
		maxlength: 16
	},
	cCVV: {
		minlength: 3,
		maxlength: 4,
		required: true,
		type: Number
	},
	cExpiration: {
		required: true,
		type: String
	},
	cType: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	investment: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Investment"
	}
});

// plugin
CardSchema.plugin(paginate);
module.exports = mongoose.model("CreditCard", CardSchema);
