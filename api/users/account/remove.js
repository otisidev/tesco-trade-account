const userService = require("../../../services/user.service");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    try {
        const user = securedRoute(req, res);
        // connect to db
        await connect();
        // remove
        const cb = await userService.removeAccount(user.id);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
