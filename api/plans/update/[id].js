const service = require("../../services/plan.service");
const { securedRoute } = require("../../services/utility.core/verifyToken");
const { connect } = require("../../mongodb");

module.exports = async (req, res) => {
    const user = securedRoute();
    await connect();
    const model = req.body;
    const { id } = req.query;
    const result = await service.updatePlan(user.id, id, model);
    return res.json(result);
};
