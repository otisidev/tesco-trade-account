const { securedRoute } = require(".../../../services/utility.core/verifyToken");
const US = require("../../../../services/user.service");
const { connect } = require("../../../../mongodb");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const state = await US.toggleUserAdminRights(req.query.id, true);
    if (state) {
        return res.json({
            status: 200,
            message: "Admin rights has been granted.",
        });
    } else {
        return res.json({
            status: 500,
            message: "An error occurred! check and try again.",
        });
    }
};
