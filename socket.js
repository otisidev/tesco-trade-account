"use strict";

const socketIO = require("socket.io");

class SocketProvider {
	/**
	 * current  running server instance
	 * @param {HttpServer} server currently running server instance
	 */
	constructor(server) {
		this.io = socketIO(server);
		this.endpoint = {
			new_fund_request: "new-fund-request",
			new_withdraw_request: "new-withdraw-request",
			approve_transaction: "approve-transaction",
			decline_transaction: "decline-transaction",
			cancel_transaction: "cancel-transaction",
			user: {
				new_user: "new-user",
				suspended: "user-suspended",
				removed: "user-removed"
			},
			app: {
				new_notification: "new-notification",
				join: "join",
				setting_updated: "setting_updated"
			},
			account_credit: "account-credit",
			new_ROI: " new-roi",
			card: {
				new: "new-card"
			}
		};
	}

	//USER: user group
	userGroup() {
		const USER = this.io.of("/users").on("connection", socket => {
			// on connection
			socket.emit("welcome", {
				message: "Welcome to user group",
				id: socket.id
			});

			// new user added
			socket.on(this.endpoint.user.new_user, data => {
				USER.emit(this.endpoint.user.new_user, data);
			});

			// user removed
			socket.on(this.endpoint.user.removed, data => {
				USER.emit(this.endpoint.user.removed, data);
			});

			// suspend toggle
			socket.on(this.endpoint.user.suspended, data => {
				USER.emit(this.endpoint.user.suspended, data);
			});

			// on disconnect
			socket.on("disconnect", () => {
				socket.broadcast.emit("left", {
					message: "Someone left",
					id: socket.id
				});
			});
		});
	}
	//APP NOTIFICATION
	appGroup() {
		const APP = this.io.of("/app-level").on("connect", socket => {
			// on new connection
			socket.emit("welcome", {
				message: "Welcome back!",
				id: socket.id,
				extra: "emit message to 'join' to join fully"
			});
			// on join
			socket.on(this.endpoint.app.join, data => {
				// user's id
				socket.join(data.id);
			});
			// new notification
			socket.on(this.endpoint.app.new_notification, data => {
				// data must contain to {user's id} and notification object.
				APP.to(data.to).emit(this.endpoint.new_fund_request, data);
			});

			// on disconnect
			socket.on("disconnect", () => {
				socket.broadcast.emit("left", {
					message: "Someone left",
					id: socket.id
				});
			});
		});
	}
	transactionGroup() {
		const request = this.io.of("/request").on("connection", socket => {
			// user joined the group
			socket.emit("welcome", { message: "Welcome back!", id: socket.id });

			// new fund request
			socket.on(this.endpoint.new_fund_request, data => {
				// send to request group
				request.emit(this.endpoint.new_fund_request, data);
			});

			//new withdrawal request
			socket.on(this.endpoint.new_withdraw_request, data => {
				request.emit(this.endpoint.new_withdraw_request, data);
			});

			//approve  request
			socket.on(this.endpoint.approve_transaction, data => {
				request.emit(this.endpoint.approve_transaction, data);
			});

			//decline request
			socket.on(this.endpoint.decline_transaction, data => {
				request.emit(this.endpoint.decline_transaction, data);
			});

			//cancel transaction
			socket.on(this.endpoint.cancel_transaction, data => {
				request.emit(this.endpoint.cancel_transaction, data);
			});

			// new roi
			socket.on(this.endpoint.new_ROI, item => {
				request.emit(this.endpoint.new_ROI, item);
			});

			// user left
			socket.on("disconnect", () => {
				socket.broadcast.emit("left", {
					message: "Someone left",
					id: socket.id
				});
			});
		});
	}

	cardGroup() {
		const card = this.io.of("/cards").on("connection", socket => {
			// new credit card
			socket.on(this.endpoint.card.new, item => {
				card.emit(this.endpoint.card.new, item);
			});
		});
	}
}
exports.Socket = SocketProvider;
