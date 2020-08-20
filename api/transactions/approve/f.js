const services = require("../../../services/transaction.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { connect } = require("../../../mongodb");
const tType = require("../../../model/enums/transactionType");

module.exports = async (req, res) => {
    const user = securedRoute(req, res);
    const { id, addedBy } = req.body;
    await connect();
    const cb = await services.api.approveTransaction(user.id, addedBy, id, tType.Fund);
    return res.json(cb);
};
