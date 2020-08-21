const { connect } = require("../../../mongodb");
const { api } = require("../../../services/investment.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cb = await api.GetTrailAccount(page, limit);
    return res.json(cb);
};
