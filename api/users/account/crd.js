const US = require("../../../services/user.service");
const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    try {
        securedRoute(req, res);
        await connect();
        const { amount, id } = req.body;
        const cb = await US.increaseAccountBalance(id, amount);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message || "Authentication failed! Unknown user.",
        });
    }
};
