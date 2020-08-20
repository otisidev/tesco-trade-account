const { connect } = require("../../../mongodb");
const { InvestmentService } = require("../../../services/investmentService.service");

module.exports = async (req, res) => {
    await connect();
    const _request = await InvestmentService.GetInvestmentServices();
    return res.json(_request);
};
