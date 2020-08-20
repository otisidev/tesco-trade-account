const services = require("../../../services/transaction.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { connect } = require("../../../mongodb");
const tType = require("../../../model/enums/transactionType");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cb = await services.api.getPendingTransaction(tType.Withdraw, page, limit);
    return res.json(cb);
};
