const jwt = require("jsonwebtoken");
const config = require("../../services/utility.core/config");

const securedRoute = (req, res) => {
    try {
        // get token from the request header
        const token = req.headers.authorization.split(" ")[1];
        // verify incoming token
        const d = jwt.verify(token, config.mongoDb.key);
        // update the current user
        return d;
    } catch (error) {
        return res.json({
            status: 401,
            message: "Authentication Failed.",
        });
    }
};
exports.securedRoute = securedRoute;
