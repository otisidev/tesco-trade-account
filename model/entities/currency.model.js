const mongoose = require("mongoose");
const scheme = mongoose.Schema;
const paginate = require("mongoose-paginate");

const currencyScheme = new scheme({
  address: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: String,
  lastModified: Date,
  date: {
    type: Date,
    default: Date.now
  },
  removed: Boolean
});

currencyScheme.plugin(paginate);
module.exports = mongoose.model("Currency", currencyScheme);
