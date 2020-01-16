"use strict";

const fundPaymentType = require("../model/entities/fundPaymentType.model");
const {ObjectId} = require("mongoose").Types;

class FundPaymentTypeService {
	/**
	 * Create new fund payment type
	 * @param {string} type new fund payment type
	 */
	async NewPaymentType(type) {
		// validation
		if (type) {
			//create instance of fundPaymentType model
			const newType = new fundPaymentType({ name: type });
			// save new object
			const cb = await newType.save();
			// check for null
			if (cb) {
				return {
					status: 200,
					message: "fund type added successfully!",
					doc: {
						id: cb._id,
						name: cb.name,
						removed: cb.removed
					}
				};
			}
		}
		return {
			status: 500,
			message: "Failed! Unable to create new fund new type"
		};
	}

	/**
	 * Get all fund payment type
	 * @param {number} limit total document per request
	 */
	async GetPaymentType(limit = 25) {
		//
		const option = {
			sort: { date: -1 },
			select: ["name", "_id", "removed"],
			limit: limit
		};
		const cb = await fundPaymentType.paginate({}, option);
		return {
			total: cb.total,
			page: cb.page,
			pages: cb.pages,
			limit: cb.limit,
			docs: cb.docs.map(item => {
				return {
					id: item._id,
					name: item.name,
					removed: item.removed
				};
			})
		};
	}
	async GetSinglePaymentType(id) {
		// validation
		if (ObjectId.isValid(id)) {
			const type = await fundPaymentType.findById(id).exec();
			if (type) {
				return {
					id: type._id,
					name: type.name,
					removed: type.removed
				};
			}
			throw new Error("Fund payment type not found!");
		}
		throw new Error("Failed! Invalid fund channel identifier.");
	}
	/**
	 * Update existing fund payment type
	 * @param {string} id fund payment type id
	 * @param {string} newType new fund type
	 */
	async UpdateFundType(id, newType) {
		// validation
		if (ObjectId.isValid(id) && newType) {
			// select and update
			const updated = await fundPaymentType.findByIdAndUpdate(id, {
				$set: {
					name: newType
				},
				$currentDate: { lastModified: true }
			});

			// check for validation
			if (updated) {
				return {
					status: 200,
					message: "Type updated successfully"
				};
			}
		}

		throw new Error("Failed! Fund type not found.");
	}
}

// export
exports.fundPaymentTypeService = new FundPaymentTypeService();
