const { connect } = require("../../../../mongodb");
const services = require("../../../../services/transaction.service");
const { securedRoute } = require("../../../../services/utility.core/verifyToken");
const transactionType = require("../../../../model/enums/transactionType");

module.exports = async (req, res) => {
    const user = securedRoute();
    await connect();
    const { model, currency } = req.body;
    const cb = await services.api.newTransaction(user.id, model, transactionType.Fund, currency);
    return res.json(cb);
};
