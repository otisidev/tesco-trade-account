const service = require("../../services/notification.service");

module.exports = async (req, res) => {
    const user = req.query.id;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    // Check if user is a valid ObjectId
    if (ObjectId.isValid(user)) {
        // get notifications of a given user
        const cb = await service.getNotification(user, page, limit);
        return res.json(cb); // return the result in json format
    } else {
        return res.json({
            status: 404,
            message: "user id not found!",
        });
    }
};
