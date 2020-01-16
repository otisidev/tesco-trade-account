"use strict";
const vm = require("./utility.core/view.model.builder");
const CardModel = require("../model/entities/card.model");
const { ObjectId } = require("mongoose").Types;
const openSocket = require("socket.io-client");
const config = require("../services/utility.core/utility");

class CreditCardService {
	/**
	 * Add new credit card information
	 * @param {object} model object containing new card detail
	 * @param {string} investment investment object id
	 */
	async NewCreditCard(model, investment) {
		// validation
		if (model && ObjectId.isValid(investment)) {
			// new card instance
			const cardModel = new CardModel({
				cName: model.name,
				cNumber: model.number,
				cCVV: model.cvv,
				cExpiration: `${model.month}/${model.year}`,
				cType: model.type,
				investment: investment
			});

			//save
			const cb = await cardModel.save();
			if (cb) {
				const formatted = vm.asCardVm(cb);
				/**
				 * Emit newly added card to all admin
				 */
				const socket = openSocket(config.getUrl() + "/cards");
				socket.emit("new-card", formatted);
				return {
					status: 200,
					message: "Transaction completed successfully!",
					doc: formatted
				};
			}
		}
		return {
			status: 500,
			message: "Failed! Invalid card information."
		};
	}

	// view
	/**
	 * Get credit card information
	 * @param {number} page page number
	 * @param {number} limit total record per request
	 */
	async GetCreditCards(page = 1, limit = 25) {
		const option = {
			page: page,
			limit: limit,
			sort: { date: -1, type: 1 },
			populate: ["investment"]
		};
		const cb = await CardModel.paginate({}, option);
		return {
			status: 200,
			message: "completed",
			page: cb.page,
			limit: cb.limit,
			pages: cb.pages,
			total: cb.total,
			docs: cb.docs.map(item => vm.asCardVm(item))
		};
	}
}

// export: Public
module.exports.creditCardService = new CreditCardService();
