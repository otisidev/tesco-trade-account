// const dotenv = require("dotenv");
// dotenv.config();
// const { DATABASE, KEY, DB_PWD, DB_USERNAME, DB_URL, DB_PORT } = process.env;
const db = {
	DB_PWD: "swiftpassword@1@2",
	DB_USERNAME: "swiftadmin",
	DB_URL: "mongodb2.webrahost.com",
	KEY: "PkgvcxHkss2r",
	DATABASE: "TescoDB",
	DB_PORT: 27017
};
module.exports = {
	mongoDb: {
		connectionString: `mongodb://${db.DB_USERNAME}:${encodeURIComponent(
			db.DB_PWD
		)}@${db.DB_URL}:${db.DB_PORT}/${db.DATABASE}?readPreference=primary`,
		database: db.DATABASE,
		key: db.KEY
	}
};
