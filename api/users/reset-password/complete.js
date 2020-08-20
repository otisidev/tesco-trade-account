const US = require("../../../services/user.service");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    try {
        await connect();
        const { id, password, code, resetId } = req.body;
        const cb = await US.CompletePasswordReset(id, password, code, resetId);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
