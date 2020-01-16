"use strict";

const bycrpt = require("bcryptjs");
const emailValidator = require("email-deep-validator");
const WalletValiadtion = require("bitcoin-address-validation");

module.exports = {
	async hash(password) {
		// validate password
		if (password) {
			// password valid
			try {
				const newPwd = await bycrpt.hash(password, 10);
				return newPwd;
			} catch (error) {
				return null;
			}
		} else {
			return null;
		}
	},
	/**
	 * Check if email address is valid
	 * @param  {string} email email address
	 */
	async isEmailValid(email) {
		// verify
		try {
			const state = await new emailValidator().verify(email);
			return state.wellFormed && state.validDomain;
		} catch (error) {
			return false;
		}
	},

	/**
	 * Check i given bitcoin wallet id is valid or not
	 * @param  {String} wallet
	 * @returns {Promise<Boolean>} true or false value
	 */
	async isWalletValid(wallet) {
		if (wallet) {
			// make http request
			try {
				const result = WalletValiadtion(wallet);
				if (result) return true;

				return false;
			} catch (error) {
				return false;
			}
		}
		return false;
	},
	/**
	 * Compare incoming password with the existing one
	 * @param  {String} password Incoming password
	 * @param  {String} hashedPassword existing password
	 */
	async comparePassword(password, hashedPassword) {
		try {
			const state = await bycrpt.compare(password, hashedPassword);
			return state;
		} catch (error) {
			return false;
		}
	}, // get running instance
	getUrl() {
		return process.env.NODE_ENV === "development"
			? "http://localhost:8087"
			: "https://account.tescoinvestment.com";
	},
	isDevelopment() {
		return process.env.NODE_ENV === "development";
	},
	GetRandomCode() {
		let text = "";
		let possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < 6; i++)
			text += possible.charAt(
				Math.floor(Math.random() * possible.length)
			);

		return text;
	}
};
