"use strict";
const fs = require("fs");
const path = require("path");
const appSettingModel = require("./model/entities/appSetting.model");

/**
 * filename and path combined
 */
const file_path = path.join(__dirname, "/services/utility.core/settings.json");

class AppSetting {
	constructor() {
		this.GetConfig().then(cb => {
			this.all = cb;
		});
	}

	/**
	 * Update application settings
	 * @param {object} model object containing application settings
	 */
	async Update(model) {
		// update same value in db
		const result = await appSettingModel
			.findOneAndUpdate(
				{},
				{
					$set: {
						validateEmail: model.validateEmail,
						validateWalletAddress: model.validateWalletAddress,
						app_name: model.name,
						next_fund_hour: model.nextFund,
						next_fund_hour_reminder: model.nextFundReminder,
						percent: model.percent
					},
					$currentDate: { lastModified: true }
				}
			)
			.exec();
		if (result) {
			this.all.validateEmail = model.validateEmail;
			this.all.validateWalletAddress = model.validateWalletAddress;
			this.all.app_name = model.name;
			this.all.percent = model.percent;
			return {
				status: 200,
				message: "Settings updated successfully."
			};
		}
		return {
			status: 500,
			message:
				"Failed! Unable to update daily transaction value, try again later."
		};
	}

	/**
	 * Update application data
	 * @param {object} model object containing application setting
	 */
	async UpdateData(model) {
		// update same value in disk
		const result = await appSettingModel
			.findOneAndUpdate(
				{},
				{
					$set: {
						"data.daily_transaction": parseInt(model.transactions),
						"data.active_Investor": parseInt(model.investors),
						"data.consultant": parseInt(model.consultants),
						"data.total_investment": parseInt(model.investments)
					},
					$currentDate: { lastModified: true }
				}
			)
			.exec();
		if (result) {
			this.all.data.daily_transaction = parseInt(model.transactions);
			this.all.data.active_investor = parseInt(model.investors);
			this.all.data.consultant = parseInt(model.consultants);
			this.all.data.total_investment = parseInt(model.investments);
			return {
				status: 200,
				message: "Application data updated successfully."
			};
		}
		return {
			status: 500,
			message:
				"Failed! Unable to update daily transaction value, try again later."
		};
	}

	async HasConfig() {
		const count = await appSettingModel.countDocuments({}).exec();
		return count > 0;
	}

	InitConfig() {
		this.HasConfig().then(state => {
			if (state) {
				return console.log("Application setting already initialized.");
			} else {
				try {
					const objectModel = ReadFile();
					// new instance of app setting
					const newAppSetting = new appSettingModel(objectModel);
					newAppSetting
						.save()
						.then(cb => {
							if (cb) {
								console.log("Application setting ready!");
							} else {
								console.error("Failed to initialized app setting");
							}
						})
						.catch(err => {
							throw err;
						});
				} catch (error) {
					console.error("App setting failed: ", JSON.stringify(error, null, 5));
					throw error;
				}
			}
		});
	}

	async GetConfig() {
		const status = await this.HasConfig();
		if (status) {
			const doc = await appSettingModel.findOne({}).exec();
			return AsViewModel(doc);
		} else {
			console.log("No configuration found!");
		}
	}
}

/**
 * Read json file from disk and return it as json object
 */
function ReadFile() {
	// read file form disk
	const cb = fs.readFileSync(file_path, {
		flag: "r"
	});

	// parse the callback
	const objectJson = JSON.parse(cb);
	// return json object representation of the callback
	return AsViewModel(objectJson);
}

/**
 * converts to valid json object
 * @param {object} model json object
 */
function AsViewModel(model) {
	return {
        app_name: model.app_name,
        url: model.url,
        account_url: "https://tesco-account.herokuapp.com" || model.account_url,
        next_fund_hour: model.next_fund_hour,
        next_fund_hour_reminder: model.next_fund_hour_reminder,
        validateEmail: model.validateEmail,
        validateWalletAddress: model.validateWalletAddress,
        auth: {
            pass: model.auth.pass,
            username: model.auth.username,
            updated_username: model.auth.updated_username,
        },
        port: model.port,
        smtp_server: model.smtp_server,

        support: {
            email: model.support.email,
            pass: model.support.pass,
        },
        data: {
            daily_transaction: parseInt(model.data.daily_transaction),
            active_investor: parseInt(model.data.active_investor),
            consultant: parseInt(model.data.consultant),
            total_investment: parseInt(model.data.total_investment),
        },
        percent: model.percent,
    };
}

// export class
exports.appSetting = new AppSetting();
