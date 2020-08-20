const { securedRoute } = require(".../../../services/utility.core/verifyToken");
const US = require("../../../../services/user.service");
const { connect } = require("../../../../mongodb");

module.exports = async (req, res) => {
    try {
        securedRoute(req, res);
        await connect();
        const state = await US.toggleAccountSuspension(req.query.id, true);
        if (state) {
            return res.json({
                status: 200,
                message: "Account has been suspended.",
            });
        } else {
            return res.json({
                status: 500,
                message: "An error occurred! check and try again.",
            });
        }
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
