const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const logScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
});

// plugin
logScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("LoginLog", logScheme);
