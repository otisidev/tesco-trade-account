const service = require("../../../services/plan.service");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    await connect();
    const { service: id } = req.query;
    const cb = await service.GetPlanByService(id);
    return res.json(cb); // return result
};
