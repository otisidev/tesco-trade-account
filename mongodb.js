const mongoose = require("mongoose");
// instance of express
const config = require("./services/utility.core/config");
const { appSetting } = require("./appsetting");

// update Promise

mongoose.Promise = global.Promise;
// connect to mongodb server
exports.connect = () =>
	mongoose.connect(
		config.mongoDb.connectionString,
		{
			useNewUrlParser: true,
			dbName: config.mongoDb.database,
			useCreateIndex: true,
			readPreference: "primary"
		},
		err => {
			if (err) {
				console.error(err.message);
			} else {
				console.log("Connected to mongodb.");
				appSetting.InitConfig();
			}
		}
	);
