const mongoose = require("mongoose");

const passwordResetModel = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	expiration: Date,
	used: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	},
	lastModified: Date
});

// export
module.exports = mongoose.model("PasswordReset", passwordResetModel);
