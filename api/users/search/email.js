const US = require("../../../services/user.service");
const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    try {
        securedRoute(req, res);
        // connect to db
        await connect();
        // get email
        const { email } = req.query;
        const cb = await US.searchUser(email);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
