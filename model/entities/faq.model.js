const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const faqScheme = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

// plugin
faqScheme.plugin(mongoose_pagination);
module.exports = mongoose.model("FAQ", faqScheme);
