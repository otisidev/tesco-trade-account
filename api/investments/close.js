const { connect } = require("../../mongodb");
const { api } = require("../../services/investment.service");
const { securedRoute } = require("../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const { id } = req.query;
    const cb = await api.closeInvestment(id);
    return res.json(cb);
};
