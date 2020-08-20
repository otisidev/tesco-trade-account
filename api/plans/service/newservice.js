const { InvestmentService } = require("../../../services/investmentService.service");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    await connect();
    const name = req.body["name"];
    const cb = await InvestmentService.NewInvestmentService(name);
    return res.json(cb);
};
