const vm = require("../services/utility.core/view.model.builder");
const Plan = require("../model/entities/investmentPlan.model");
const activity = require("../services/activity.service");
const ViewModel = require("../model/views/plan.view");
const { ObjectId } = require("mongoose").Types;

module.exports = {
	// new plan
	/**
	 * Create new investment plan
	 * @param  {string} user the id of the user performing the operation
	 * @param  {ViewModel} model investment plan object to add to database collection
	 */
	async newPlan(user, model) {
		// validation
		if (
			model.title &&
			model.min_amount &&
			model.max_amount &&
			model.percent &&
			ObjectId.isValid(model.service)
		) {
			try {
				const newPlan = new Plan({
					title: model.title,
					minAmount: model.min_amount,
					maxAmount: model.max_amount,
					description: model.description,
					percent: model.percent,
					service: model.service
				});
				const _plan = await newPlan.save();
				// log activity
				if (user)
					await activity.addToTimeline(
						user,
						`You added new investment plan: '${_plan.title}'.`
					);
				return {
					status: 200,
					message: "Completed!",
					doc: vm.asPlanVm(_plan)
				};
			} catch (error) {
				return {
					status: 500,
					message: error.message
				};
			}
		} else {
			return {
				status: 500,
				message: "Bad data! Title, amount, and percent are require fields."
			};
		}
	},
	/**
	 * Get All available investment plans
	 */
	async getInvestmentPlans() {
		let list = await Plan.aggregate([
			{ $match: { removed: false } },
			{
				$group: {
					_id: "$service",
					plans: { $push: "$$ROOT" }
				}
			}
		]).exec();
		list = await Plan.populate(list, {
			model: "InvestmentService",
			path: "_id"
		});
		return {
			status: 200,
			message: "Completed!",
			docs: list.map(p => {
				return {
					service: p._id.name,
					id: p._id._id,
					plans: p.plans.map(item => vm.asPlanVm(item))
				};
			})
		};
	},
	async GetPlanByService(service) {
		//validation
		if (ObjectId(service)) {
			// query
			const cb = await Plan.find({
				$and: [{ service: service }, { removed: false }]
			})
				.populate(["service"])
				.sort({ minAmount: 1 })
				.exec();
			return {
				status: 200,
				message: "Completed",
				docs: cb.map(i => vm.asPlanVm(i))
			};
		}
		return {
			status: 500,
			message: "Serice not found!"
		};
	},
	/**
	 * Updated existing investment plan
	 * @param  {string} user id of the user making the request
	 * @param  {string} id id of the plan to be updated.
	 * @param  {ViewModel} model model containing title, amount, percent
	 */
	async updatePlan(user, id, model) {
		//validation
		if (ObjectId.isValid(user) && ObjectId.isValid(id) && model) {
			try {
				const updated = await Plan.updateOne(
					{ $and: [{ _id: id }, { removed: false }] },
					{
						$set: {
							title: model.title,
							description: model.description,
							minAmount: model.min_amount,
							maxAmount: model.max_amount,
							percent: model.percent
						},
						$currentDate: { lastModified: true }
					}
				).exec();
				if (updated.ok > 0) {
					// check for null
					await activity.addToTimeline(
						user,
						`You updated: ${model.title} plan.`
					);
					return {
						status: 200,
						message: "Investment plan updated successfully!"
					};
				} else {
					return false;
				}
			} catch (error) {
				return {
					status: 500,
					message: error.message
				};
			}
		} else {
			return {
				status: 500,
				message: "Bad data! user's id and plan id not found!"
			};
		}
	},
	/**
	 * Check if investment plan wit given id  exists
	 * @param  {string} id investment plan id
	 */
	async doesPlanExist(id) {
		const state = await Plan.countDocuments({ _id: id }).exec();
		return state > 0;
	},
	/**
	 * Get single investment plan object
	 * @param  {string} id The id of the investment plan to be retrieved.
	 */
	async getSinglePlan(id) {
		if (!ObjectId.isValid(id))
			return {
				status: 404,
				message: "Investment plan not found!"
			};
		try {
			const plan = await Plan.findOne({
				$and: [{ _id: id }, { removed: false }]
			}).exec();
			return {
				status: 200,
				message: "Completed",
				doc: vm.asPlanVm(plan)
			};
		} catch (error) {
			throw error;
		}
	},
	/**
	 * Get suitable plan for a particular amount
	 * @param  {Number} amount the funded amount
	 */
	async getSinglePlanByAmount(amount) {
		const obj = await Plan.find({
			$and: [{ maxAmount: { $gte: amount } }, { removed: false }]
		})
			.sort({ minAmount: 1 })
			.exec();
		if (obj.length > 0) {
			return vm.asPlanVm(obj[0]);
		} else {
			throw new Error("No plan found.");
		}
	},
	/**
	 * Remove investment plan
	 * @param {string} id investment plan id
	 */
	async removeInvestmentPlan(id) {
		if (!ObjectId.isValid(id))
			return {
				status: 404,
				message: "Investment plan not found!"
			};
		try {
			const obj = await Plan.findByIdAndUpdate(id, {
				set: { removed: true },
				$currentDate: { lastModified: true }
			}).exec();
			if (obj) {
				return {
					status: 200,
					message: "Investment removed successfully!"
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error.message
			};
		}
	}
};
