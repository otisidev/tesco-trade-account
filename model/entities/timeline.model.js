const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const timelineScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  phrase: {
    type: String,
    required: true
  }
});

// plugin
timelineScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("Timeline", timelineScheme);
