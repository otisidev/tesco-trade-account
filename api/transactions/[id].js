const services = require("../../services/transaction.service");
const { connect } = require("../../mongodb");

module.exports = async (req, res) => {
    const page = parseInt(req.query.page); // page number
    const limit = parseInt(req.query.limit); // page size
    // connect to db
    await connect();
    // fetch data
    const result = await services.api.getTransaction(req.query.id, page, limit);
    return res.json(result);
};
