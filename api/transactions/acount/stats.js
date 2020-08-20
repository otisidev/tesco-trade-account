const { appSetting } = require("../../../appsetting");


module.exports = async (req, res) => {
    const { today, activeInvestor, consultant } = req.body;
    // console.log("Body: ", JSON.stringify({ today, activeInvestor, consultant }, null, 6));
    appSetting.updateConstant(activeInvestor);
    appSetting.updateDailyTransaction(today);
    // appSetting.update(today);
    return res.json({
        today: appSetting.DAILYTRANSACTION,
        activeInvestor: appSetting.ACTIVEINVESTOR,
        consultant: appSetting.CONSULTANT,
    });
}