const { connect } = require("../../../../mongodb");
const appSettingService = require("../../../../appsetting").appSetting;

module.exports = async (req, res) => {
    await connect();
    const cb = await appSettingService.GetConfig();
    return res.json({
        status: 200,
        message: "completed",
        doc: {
            data: {
                transactions: cb.data.daily_transaction,
                investors: cb.data.active_investor,
                consultants: cb.data.consultant,
                investments: cb.data.total_investment,
            },
            setting: {
                name: cb.app_name,
                validateEmail: cb.validateEmail,
                validateWallet: cb.validateWalletAddress,
                next_fund_hour: cb.next_fund_hour,
                next_fund_hour_reminder: cb.next_fund_hour_reminder,
                percent: cb.percent,
            },
        },
    });
};
