const { connect } = require("../../../../mongodb");
const appSettingService = require("../../../../appsetting").appSetting;

module.exports = async (req, res) => {
    await connect();
    const cb = await appSettingService.UpdateData(req.body);
    return res.json(cb);
};
