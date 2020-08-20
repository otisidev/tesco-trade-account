const { sendConfirmEmail } = require("../../../services/mailing.service").mailingService;

module.exports = async (req, res) => {
    const { email, id, name } = req.body;
    if (email && id && name) {
        const cb = await sendConfirmEmail(id, email, name);
        return res.json(cb);
    }
    return res.json({
        status: 500,
        message: "Email address not found!",
    });
};
