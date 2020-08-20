const US = require("../../../services/user.service");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    try {
        await connect();
        const email = req.body["email"] || "";
        const cb = await US.SendPasswordReset(email);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
