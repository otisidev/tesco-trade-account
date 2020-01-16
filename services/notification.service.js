"use strict";

const Notification = require("../model/entities/notification.model");
const NotificationType = require("../model/enums/notificationType");
const vm = require("../services/utility.core/view.model.builder");
const openSocket = require("socket.io-client");
const config = require("../services/utility.core/utility");

const socket = openSocket(config.getUrl() + "/app-level");
/**
 * Send notification of a particular type to user
 * @param  {string} user user id
 * @param  {String} message message to send to user
 * @param  {NotificationType} type type of message to send to user
 */
async function sendNotification(user, message, type, heading) {
	// validation
	if (user && message) {
		try {
			const notify = new Notification({
				user: user,
				message: message,
				type: type,
				heading: heading
			});
			// save
			const result = await notify.save();
			if (result._id) {
				// send notification here
				socket.emit("join",{id:user})
				socket.emit("new-notification", { to: user, doc: result });
				return true;
			}
			return false;
		} catch (error) {
			return false;
		}
	} else {
		return false;
	}
}
/**
 * Send Notification to user with i given id
 * @param  {String} user id of user
 * @param  {Number} page page number
 * @param  {Number} limit how many record to reutn per request
 */
async function getNotification(user, page = 1, limit = 10) {
	const query = {
		$and: [{ user: user }, { removed: false }]
	};
	const option = {
		page: page,
		limit: limit,
		sort: { date: -1 }
	};
	const list = await Notification.paginate(query, option);
	return {
		status: 200,
		message: "Completed",
		page: list.page,
		pages: list.pages,
		limit: list.limit,
		docs: list.docs.map(n => vm.asNotificationVm(n)),
		total: list.total
	};
}
/**
 * Update notification seen state
 * @param {string} id update notification seen state
 */
async function markAsRead(id) {
	try {
		const state = await Notification.updateOne(
			{ _id: id },
			{ $set: { seen: true } }
		).exec();
		if (state.ok) {
			return {
				status: 200,
				message: "Notification marked as read."
			};
		} else {
			throw new Error("");
		}
	} catch (error) {
		throw error;
	}
}
// make public
module.exports = {
	sendNotification,
	getNotification,
	markAsRead
};
