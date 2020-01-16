"use strict";
const mongoose = require("mongoose");

const AppSetting = new mongoose.Schema({
	app_name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	lastModified: Date,
	url: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	account_url: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	next_fund_hour: {
		type: Number,
		required: true
	},
	next_fund_hour_reminder: {
		type: Number,
		required: true
	},
	validateEmail: {
		type: Boolean,
		default: true
	},
	validateWalletAddress: {
		type: Boolean,
		default: true
	},
	auth: {
		pass: {
			type: String,
			trim: true,
			required: true
		},
		username: {
			type: String,
			trim: true,
			required: true
		},
		updated_username: {
			type: String,
			trim: true,
			required: true
		}
	},
	port: {
		type: Number,
		default: 465
	},
	smtp_server: {
		type: String,
		trim: true,
		required: true
	},
	data: {
		daily_transaction: {
			type: Number,
			default: 2310
		},
		active_investor: {
			type: Number,
			default: 2021
		},
		consultant: {
			type: Number,
			default: 253
		},
		total_investment: {
			type: Number,
			default: 2419
		}
	},
	support: {
		email: {
			type: String,
			required: true,
			trim: true
		},
		pass: {
			type: String,
			required: true,
			trim: true
		}
	},
	percent: {
		type: Number,
		default: 0.1
	}
});
// export public
module.exports = mongoose.model("AppSetting", AppSetting);
