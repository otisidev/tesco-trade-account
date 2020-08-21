const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { fundPaymentTypeService } = require("../../../services/fundPaymentType.service");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const { id, name } = req.body;
    const cb = await fundPaymentTypeService.UpdateFundType(id, name);
    return res.json(cb);
};
