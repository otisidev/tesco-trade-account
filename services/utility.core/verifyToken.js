// const jwt = require("jsonwebtoken");
// const config = require("../../services/utility.core/config");

// const securedRoute = (req, res) => {
//     try {
//         // get token from the request header
//         const token = req.headers.authorization.split(" ")[1];
//         // verify incoming token
//         const d = jwt.verify(token, config.mongoDb.key);
//         // update the current user
//         return d;
//     } catch (error) {
//         return res.json({
//             status: 401,
//             message: "Authentication Failed.",
//         });
//     }
// };
// exports.securedRoute = securedRoute;
const jwt = require("jsonwebtoken");
const config = require("../../services/utility.core/config");
/**
 * Check for incoming request for token
 * @param  {Request} req
 * @param  {Response} res
 * @param  {next} next
 * sets currentUser object
 */
module.exports = (req, res, next) => {
    try {
        // get token from the request header
        const token = req.headers.authorization.split(" ")[1];
        // verify incoming token
        const d = jwt.verify(token, config.mongoDb.key);
        // update the current user
        req.currentUser = d;
        // next middleware
        next();
    } catch (error) {
        return res.json({
            status: 401,
            message: "Authentication Failed.",
        });
    }
};