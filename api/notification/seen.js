const service = require("../../services/notification.service");

module.exports = async (req, res) => {
    const user = req.query.id;
    const cb = await service.markAsRead(user);
    return res.json(cb);
};
