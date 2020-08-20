const { connect } = require("../../../mongodb");
const { securedRoute } = require("../../../services/utility.core/verifyToken");
const timelineService = require("../../../services/activity.service");

module.exports = async (req, res) => {
    const user = securedRoute(req, res);
    await connect();
    const cb = await timelineService.getTimeline(user.id, 1, 10);
    return res.json(cb);
};
