const { securedRoute } = require(".../../../services/utility.core/verifyToken");
const US = require("../../../../services/user.service");
const { connect } = require("../../../../mongodb");

module.exports = async (req, res) => {
    securedRoute(req, res);
    await connect();
    const state = await US.toggleUserAdminRights(req.query.id, false);
    if (state) {
        return res.status(200).json({
            status: 200,
            message: "Admin rights has been lifted",
        });
    } else {
        return res.json({
            status: 500,
            message: "An error occurred! check and try again.",
        });
    }
};
