const service = require("../services/plan.service");
const { InvestmentService } = require("../services/investmentService.service");

module.exports = {
	newPlan: async (req, res) => {
		const model = req.body;
		const id = req.currentUser && req.currentUser.id;
		const newObject = await service.newPlan(id, model);
		return res.json(newObject);
	},
	updatePlan: async (req, res) => {
		const model = req.body;
		const { id } = req.params;
		const updateObj = await service.updatePlan(req.currentUser.id, id, model);
		return res.json(updateObj);
	},
	getplans: async (req, res) => {
		const arr = await service.getInvestmentPlans();
		return res.json(arr);
	},
	// get single investment plan
	getSinglePlan: async (req, res) => {
		const id = req.params.id;
		const object = await service.getSinglePlan(id); // get single investment plan
		return res.json(object);
	},
	// remove investment plan
	deleteSinglePlan: async (req, res) => {
		const id = req.params.id;
		const _request = await service.removeInvestmentPlan(id);
		return res.json(_request);
	}
};
/**
 * Invesmtent service
 */
module.exports.service = {
	//all
	GetAll: async (req, res) => {
		const _request = await InvestmentService.GetInvestmentServices();
		return res.json(_request);
	},
	NewRecord: async (req, res) => {
		const name = req.body["name"];
		const cb = await InvestmentService.NewInvestmentService(name);
		return res.json(cb);
	},
	UpdateRecord: async (req, res) => {
		const { name, id } = req.body;
		const cb = await InvestmentService.UpdateServiceModel(id, name);
		return res.json(cb);
	},
	GetPlansByService: async (req, res) => {
		const serviceId = req.params["service"];
		// get plans based on service
		const cb = await service.GetPlanByService(serviceId);
		return res.json(cb); // return result
	}
};
