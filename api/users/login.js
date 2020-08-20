const US = require("../../services/user.service");
const { connect } = require("../../mongodb");

module.exports = async (req, res) => {
    try {
        await connect();
        const { email, password } = req.body;
        // validate
        const user = await US.getUserByEmail(email);
        if (user) {
            //login here
            const cb = await US.login(email, password);
            return res.json(cb);
        } else {
            return res.json({
                status: 404,
                message: "Authentication failed! Unknown user.",
            });
        }
    } catch (err) {
        return res.json({
            status: 500,
            message: "Authentication failed! Unknown user.",
        });
    }
};
