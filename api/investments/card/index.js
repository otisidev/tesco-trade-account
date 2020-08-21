const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { creditCardService } = require("../../../services/creditCard.service");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const { investment } = req.query;
    const cb = await creditCardService.NewCreditCard(req.body, investment);
    return res.json(cb);
};
