const { connect } = require("../../../mongodb");
const transService = require("../../../services/transaction.service");

module.exports = async (req, res) => {
    // connect to db
    await connect();
    const result = await transService.api.getUserFirstTransaction(req.query.id);
    return res.json(result);
};
