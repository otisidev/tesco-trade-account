const { connect } = require("../../../mongodb");
const { api } = require("../../../services/investment.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const { id, amount } = req.body;
    const cb = await api.IncreaseCurrentBalance(id, amount);
    return res.json(cb);
};
