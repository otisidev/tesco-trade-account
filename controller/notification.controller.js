const service = require("../services/notification.service");
const { ObjectId } = require("mongoose").Types;
const { request, response } = require("express");

module.exports = {
	// new
	/**
	 * @param {request} req
	 * @param {response} res
	 */
	getNotify: async (req, res) => {
		const user = req.params.id;
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
				message: "user id not found!"
			});
		}
	},
	/**
	 * @param {request} req
	 * @param {response} res
	 */
	markAsSeen: async (req, res) => {
		const user = req.params.id;
		const cb = await service.markAsRead(user);
		return res.json(cb);
	}
};
