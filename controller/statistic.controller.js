"use strict";
const { statisticService } = require("../services/statistic.service");

class StatisticController {
	async getAppStatictis(req, res) {
		const cb = await statisticService.GetStatistics();
		return res.json(cb);
	}
}
module.exports.statisticController = new StatisticController();
