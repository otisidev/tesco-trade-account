const { connect } = require("../../../../mongodb");
const services = require("../../../../services/transaction.service");

module.exports = async (req, res) => {
    await connect();
    const { id } = req.body || req.query;
    // perform operation
    const cb = await services.api.reviewTransaction(id);
    return res.json(cb);
};
