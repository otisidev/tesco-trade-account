const { connect } = require("../../../mongodb");
const { api, PROPS_KEY } = require("../../../services/investment.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    try {
        securedRoute(req, res);
        await connect();
        const { id, investmentMade } = req.body;
        const cb = await api.UpdatePropFigure(id, investmentMade, PROPS_KEY.investmentMade);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
