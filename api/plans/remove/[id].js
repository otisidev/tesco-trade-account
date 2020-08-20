const service = require("../../../services/plan.service");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    await connect();
    const { id } = req.query;
    const _request = await service.removeInvestmentPlan(id);
    return res.json(_request);
};
