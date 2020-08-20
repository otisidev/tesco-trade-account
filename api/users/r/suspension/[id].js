const { securedRoute } = require(".../../../services/utility.core/verifyToken");
const US = require("../../../../services/user.service");
const { connect } = require("../../../../mongodb");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const state = await US.toggleAccountSuspension(req.params.id, false);
    if (state) {
        return res.json({
            status: 200,
            message: "Account suspension has been resolved.",
        });
    } else {
        return res.json({
            status: 500,
            message: "An error occurred! check and try again.",
        });
    }
};
