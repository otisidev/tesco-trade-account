const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { fundPaymentTypeService } = require("../../../services/fundPaymentType.service");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const { name } = req.body;
    const cb = await fundPaymentTypeService.NewPaymentType(name);
    return res.json(cb);
};
