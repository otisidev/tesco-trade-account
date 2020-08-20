const service = require("../../services/plan.service");
const { securedRoute } = require("../../services/utility.core/verifyToken");
const { connect } = require("../../mongodb");

module.exports = async (req, res) => {
    securedRoute();
    await connect();
    const result = await service.getInvestmentPlans();
    return res.json(result);
};
