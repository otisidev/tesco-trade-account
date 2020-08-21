const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { fundPaymentTypeService } = require("../../../services/fundPaymentType.service");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const cb = await fundPaymentTypeService.GetPaymentType();
    return res.json(cb);
};
