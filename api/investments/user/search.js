const { connect } = require("../../../mongodb");
const { api } = require("../../../services/investment.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    try {
        securedRoute(req, res);
        await connect();
        const { keyword } = req.query;
        const cb = await api.SearchInvestment(keyword);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
