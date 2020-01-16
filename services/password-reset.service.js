"use strict";
const PasswordResetModel = require("../model/entities/password-reset.model");
const mongoose = require("mongoose");

class PasswordResetService {
	/**
	 * new change of password request
	 * @param {string} email user email address
	 * @param {string} code activation code
	 */
	async NewPasswordRequest(email, code) {
		// data validation
		if (email && code) {
			// Check for exiting record
			const status = await this.HasUserLoggedForReset(email);
			if (status) {
				const result = await this.GetSingleRecordByEmail(email);
				return result;
			}

			// expiration date
			let date = new Date();
			date = date.setHours(date.getHours() + 48);

			// new password reset model
			const model = new PasswordResetModel({
				code: code,
				email: email,
				expiration: date
			});

			// save
			const cb = await model.save();
			if (cb) {
				return {
					status: 200,
					message: "Completed",
					doc: {
						code: cb.code,
						email: cb.email,
						expiration: cb.expiration,
						used: cb.used,
						id: cb._id
					}
				};
			}
			throw new Error("Failed! Unable to initialize password reset.");
		}
		throw new Error("Email address not found!");
	}

	/**
	 * Complete password reset process
	 * @param {string} id reset password id
	 * @param {string} code activation code
	 */
	async CompleteReset(id, code) {
		// validation
		if (mongoose.Types.ObjectId.isValid(id) && code) {
			// today's date
			const date = new Date();
			// fetch record
			const model = await PasswordResetModel.findById(id).exec();

			// compare code and expiration date
			if (model && model.code === code && model.expiration >= date) {
				// update
				const cb = await PasswordResetModel.findByIdAndUpdate(id, {
					$set: {
						used: true
					},
					$currentDate: { lastModified: true }
				}).exec();
				if (cb) {
					return {
						status: 200,
						message: "Password updated successfully"
					};
				}
			}
			throw new Error("Failed! Code is invalid or has expired.");
		}
		throw new Error("Bad data! Activation code is invalid.");
	}

	/**
	 * Check if user with a particular email address has applied for password reset
	 * @param {string} email user email address
	 */
	async HasUserLoggedForReset(email) {
		// validation
		if (email) {
			// current date
			const date = new Date();

			// query record
			const model = await PasswordResetModel.findOne({
				$and: [
					{ email: email },
					{ used: false },
					{ expiration: { $gte: date } }
				]
			}).exec();
			return model !== null;
		}
		throw new Error("Email address is required!");
	}
	/**
	 * Get single password reset object using email address
	 * @param {string} email user email address
	 */
	async GetSingleRecordByEmail(email) {
		// validation
		if (email) {
			// current date
			const date = new Date();

			// query
			const model = await PasswordResetModel.findOne({
				$and: [
					{ email: email },
					{ used: false },
					{ expiration: { $gte: date } }
				]
			}).exec();
			if (model) {
				return {
					status: 200,
					message: "Completed",
					doc: {
						code: model.code,
						email: model.email,
						expiration: model.expiration,
						used: model.used,
						id: model._id
					}
				};
			}
			throw new Error("No record found!");
		}
		throw new Error("Failed! Email address not found.");
	}
}
exports.passwordResetService = new PasswordResetService();
