const router = require("express").Router();
const secured = require("../services/utility.core/verifyToken");
const controller = require("../controller/plan.controller");

// new plan
router.post("/addplan", controller.newPlan);

// get plans
router.get("/", controller.getplans);

//single investment plan
router.get("/:id", controller.getSinglePlan);

//single investment plan
router.put("/:id/update", secured, controller.updatePlan);

//single investment plan
router.delete("/:id/remove", secured, controller.deleteSinglePlan);

/**
 * Investment service endpoints
 */
router.get("/service/getall", controller.service.GetAll);

router.get("/service/:service", controller.service.GetPlansByService);

// new
router.post("/service/newservice", secured, controller.service.NewRecord);

// update
router.put("/service/updateservice", secured, controller.service.UpdateRecord);
// make public
module.exports = router;
