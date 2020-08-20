const { statisticService } = require("../../../services/statistic.service");
const { connect } = require("../../../mongodb");

module.exports = async (req, res) => {
    await connect();
    const cb = await statisticService.GetStatistics();
    return res.json(cb);
};
