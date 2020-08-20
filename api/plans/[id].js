const service = require("../../services/plan.service");
const { securedRoute } = require("../../services/utility.core/verifyToken");
const { connect } = require("../../mongodb");

module.exports = async (req, res) => {
    securedRoute();
    await connect();
    const { id } = req.query;
    const result = await service.getSinglePlan(id); // get single investment plan
    return res.json(result);
};
