const { InvestmentService } = require("../../../services/investmentService.service");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    await connect();
    const { name, id } = req.body;
    const cb = await InvestmentService.UpdateServiceModel(id, name);
    return res.json(cb);
};
