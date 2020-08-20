const userService = require("../../../services/user.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    // connect to db
    await connect();
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const user = securedRoute(req, res);
    const cb = await userService.getUserReferral(user.id, page, limit);
    return res.json(cb);
};
