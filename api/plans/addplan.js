const service = require("../../services/plan.service");
const { securedRoute } = require("../../services/utility.core/verifyToken");
const { connect } = require("../../mongodb");

module.exports = async (req, res) => {
    const user = securedRoute();
    await connect();
    const model = req.body;
    const result = await service.newPlan(user.id, model);
    return res.json(result);
};
