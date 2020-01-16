const mongoose = require("mongoose");
const mongoose_pagination = require("mongoose-paginate");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  zipCode: Number,
  option: {
    notifyOnLogin: {
      type: Boolean,
      default: true
    },
    useEmailLogin: {
      type: Boolean,
      default: false
    }
  },
  suspended: {
    type: Boolean,
    default: false
  },
  accountVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  bitcoinWalletAddress: {
    type: String,
    required: true,
    unique: true
  },
  removed: {
    type: Boolean,
    default: false
  },
  lastModified: Date,
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  plan: {
    lastModified: Date,
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentPlan"
    }
  }
});

// use pagination plugin
userSchema.index(["name", "email"]);
userSchema.plugin(mongoose_pagination);
module.exports = mongoose.model("User", userSchema);
