const MS = require("../../../services/mailing.service").mailingService;

module.exports = async (req, res) => {
    const { email, subject, name, body, user } = req.body;
    if (email && subject && name && body) {
        const cb = await MS.sendEmail(name, email, subject, body, user);
        return res.json(cb);
    }
    return res.json({
        status: 500,
        message: "Email address not found!",
    });
};
