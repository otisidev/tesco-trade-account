const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { creditCardService } = require("../../../services/creditCard.service");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const page = parseInt(req.query["page"] || "1");
    const limit = parseInt(req.query["limit"] || "25");
    const cb = await creditCardService.GetCreditCards(page, limit);
    return res.json(cb);
};
