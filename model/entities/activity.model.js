const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const activityScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// plugin
activityScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("Activity", activityScheme);
