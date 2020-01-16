const Currency = require("../model/entities/currency.model");
const vm = require("../services/utility.core/view.model.builder");
const { ObjectId } = require("mongoose").Types;

module.exports.endpoint = {
	//new

	/** Add new crypto currency
	 * @param  {Object} model json object containing name, address, and icon for the new currency
	 */
	async newCurrency(model) {
		// validation
		if (!model.name || !model.address)
			return {
				status: 404,
				message: "Bad data! Currency name and address are required."
			};
		try {
			const currency = new Currency({
				address: model.address,
				icon: model.icon,
				name: model.name,
				removed: false
			});
			const newCurrency = await currency.save();
			if (newCurrency) {
				return {
					status: 200,
					message: "New currency added successfully!",
					doc: vm.asCurrencyVm(newCurrency)
				};
			} else {
				return {
					status: 404,
					message: "An error occurred, please try again later."
				};
			}
		} catch (error) {
			return {
				status: 404,
				message: error.message
			};
		}
	},
	/**
	 * get all avaiable crypto currency
	 */
	async getCurrenies() {
		const list = await Currency.find({ removed: false })
			.sort({ name: 1 })
			.exec();
		if (list.length) {
			return {
				status: 200,
				message: "Completed",
				docs: list.map(d => {
					return vm.asCurrencyVm(d);
				})
			};
		} else {
			throw new Error("No cryptocurrency found, add new and try again");
		}
	},
	async getCurrency(id) {
		const model = await Currency.findOne({
			$and: [{ removed: false }, { _id: id }]
		})
			.sort({ name: 1 })
			.exec();
		if (model) {
			return {
				status: 200,
				message: "Completed",
				doc: vm.asCurrencyVm(model)
			};
		} else {
			throw new Error("No cryptocurrency found, add new and try again");
		}
	},
	/**
	 * Update existing crypto currency object
	 * @param {string} id currency's id
	 * @param {Object} model currency object containing new name, address, and icon
	 */
	async updateCurrency(id, model) {
		// validation
		if (!ObjectId.isValid(id) || !model.name || !model.address)
			return {
				status: 404,
				message: "Bad data! Invalid currency name or address."
			};
		try {
			const state = await Currency.updateOne(
				{ _id: id },
				{
					$set: {
						name: model.name,
						address: model.address,
						icon: model.icon
					},
					$currentDate: {
						lastModified: true
					}
				}
			);
			if (state.ok > 0) {
				return {
					status: 200,
					message: "Completed successfully!"
				};
			} else {
				return {
					status: 404,
					message: "Unable to update currency! Check and try again."
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error.message
			};
		}
	},
	/**
	 * remove existing crypto currency object
	 * @param {string} id currency's id
	 */
	async deleteCurrency(id) {
		// validation
		if (ObjectId.isValid(id)) {
			try {
				const state = await Currency.updateOne(
					{ _id: id },
					{ $set: { removed: true }, $currentDate: { lastModified: true } }
				);
				if (state.ok > 0) {
					return {
						status: 200,
						message: "Completed successfully!"
					};
				}
			} catch (error) {
				return {
					status: 500,
					message: error.message
				};
			}
		}
		return {
			status: 500,
			message: "Failed! Unable to remove currency."
		};
	}
};
