const { connect } = require("../../../mongodb");
const CS = require("../../../services/currency.services");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const { id } = req.query;
    const cb = await CS.endpoint.deleteCurrency(id);
    return res.json(cb);
};
