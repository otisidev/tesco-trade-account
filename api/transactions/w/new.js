const services = require("../../../services/transaction.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { connect } = require("../../../mongodb");
const tType = require("../../../model/enums/transactionType");

module.exports = async (req, res) => {
    const user = securedRoute(req, res);
    await connect();
    const { amount, id, currency } = req.body;
    const cb = await services.api.newTransaction(user.id, { amount: amount, investment: id }, tType.Withdraw, currency);
    return res.json(cb);
};
