const { appSetting } = require("../../../appsetting");

module.exports = (req, res) => {
    return res.json({
        today: appSetting.all.data.daily_transaction,
        activeInvestor: appSetting.all.data.active_investor,
        consultant: appSetting.all.data.consultant,
        accountCreated: appSetting.all.data.total_investment,
        status: 200,
        message: "Completed",
    });
};
