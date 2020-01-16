"use strict";
const InvestmentServiceModel = require("../model/entities/investmentService.model");
const mongoose = require("mongoose");

class InvestmentService {
	//new
	/**
	 * Create new investment service object
	 * @param {string} name name of investment service
	 */
	async NewInvestmentService(name) {
		//validation
		if (name) {
			// new instance
			const model = new InvestmentServiceModel({ name });
			// save
			const cb = await model.save();
			if (cb) {
				return {
					status: 200,
					message: "Investment service added successfully",
					doc: createViewModel(cb)
				};
			}
			throw new Error("Failed! Invalid service name.");
		}
		throw new Error("Failed! Service name not found.");
	}
	/**
	 * Get all investment service object
	 */
	async GetInvestmentServices() {
		// doc query
		const option = {
			sort: { date: -1, name: 1 },
			select: ["name", "_id", "date"]
		};
		// exec
		const cb = await InvestmentServiceModel.paginate({}, option);
		return {
			status: 200,
			message: "Completed",
			docs: cb.docs.map(i => createViewModel(i)),
			page: cb.page,
			pages: cb.pages,
			total: cb.total
		};
	}

	//update
	/**
	 * Update existing investment service object name
	 * @param {string} id investment service object id
	 * @param {string} name new investment service object name
	 */
	async UpdateServiceModel(id, name) {
		//validation
		if (mongoose.Types.ObjectId.isValid(id) && name) {
			// exec
			const cb = await InvestmentServiceModel.findByIdAndUpdate(id, {
				$set: { name },
				$currentDate: { lastModified: true }
			}).exec();
			if (cb) {
				return {
					status: 200,
					message: "Service updated succeddfully.",
					doc: createViewModel(cb)
				};
			}
			throw new Error("Invaild service name!");
		}
		throw new Error("Service name not found!");
	}
}

/**
 * create a view model for investment service model
 * @param {object} model object containing investment service model
 */
function createViewModel(model) {
	return {
		id: model._id,
		name: model.name,
		date: model.date
	};
}

exports.InvestmentService = new InvestmentService();
