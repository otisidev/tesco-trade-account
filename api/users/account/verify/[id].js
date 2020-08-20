const US = require("../../../../services/user.service");
const { connect } = require("../../../../mongodb");

module.exports = async (req, res) => {
    try {
        await connect();
        const cb = await US.verifyAccount(req.params.id);
        return res.json(cb);
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
