const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const testimonyScheme = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	picture: {
		type: String,
		required: true
	},
	feedback: {
		type: String,
		required: true
	},
	Status: {
		type: Boolean,
		default: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	is_active: {
		type: Boolean,
		default: true
	}
});

// plugin
testimonyScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("Testimony", testimonyScheme);
