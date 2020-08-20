const US = require("../../../services/user.service");
const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    try {
        // check token
        securedRoute(req, res);
        await connect();
        const { userid, planid } = req.body;
        const cb = await US.subscribToPlan(userid, planid);
        return res.json(cb);
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Authentication failed! Unknown user.",
        });
    }
};
