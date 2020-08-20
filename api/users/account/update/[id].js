const US = require("../../../../services/user.service");
const { connect } = require("../../../../mongodb");
const { securedRoute } = require("../../../../services/utility.core/verifyToken");

module.exports = async (req, res) => {
    try {
        const user = securedRoute();
        await connect();
        const cb = await US.updateAccount(user.id, req.body);
        if (cb)
            return res.json({
                status: 200,
                message: "Profile updated successfully.",
            });
        else
            return res.json({
                status: 500,
                message: "Failed! Unable to update profile.",
            });
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
