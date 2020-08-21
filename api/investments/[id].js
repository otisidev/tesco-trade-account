const { connect } = require("../../mongodb");
const { api } = require("../../services/investment.service");

module.exports = async (req, res) => {
    const { id } = req.query;
    await connect();
    const cb = await api.getInvestments(id);
    return res.json(cb);
};
