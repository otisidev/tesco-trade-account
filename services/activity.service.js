"use strict";

const Timeline = require("../model/entities/timeline.model");
const vm = require("../services/utility.core/view.model.builder");

module.exports = {
	/**
	 * Add new timeline record
	 * @param  {String} id
	 * @param  {String} phrase
	 */
	async addToTimeline(id, phrase) {
		const timeline = new Timeline({
			user: id,
			phrase: phrase
		});
		const result = await timeline.save();
		return result._id !== null;
	},
	/**
	 * Get list of activity for a particular user
	 * @param  {string} id
	 * @param  {Number} page
	 * @param  {Number } limit
	 */
	async getTimeline(id, page, limit) {
		const option = {
			limit: limit || 25,
			page: page || 1,
			sort: { date: -1 }
		};
		const results = await Timeline.paginate({ user: id }, option);

		return {
			status: 200,
			message: "Completed successfully!!",
			docs: results.docs.map(time => vm.asTimelineVm(time)),
			total: results.total,
			limit: results.limit,
			pages: results.pages,
			page: results.page
		};
	}
};
