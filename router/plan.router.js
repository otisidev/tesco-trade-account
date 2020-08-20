const router = require("express").Router();
const secured = require("../services/utility.core/verifyToken");
const controller = require("../controller/plan.controller");

// new plan: DONE
router.post("/addplan", controller.newPlan);

// get plans: DONE
router.get("/", controller.getplans);

//single investment plan: DONE
router.get("/:id", controller.getSinglePlan);

//single investment plan: DONE
router.put("/:id/update", secured, controller.updatePlan);

//single investment plan
router.delete("/:id/remove", secured, controller.deleteSinglePlan);

/**
 * Investment service endpoints :DONE
 */
router.get("/service/getall", controller.service.GetAll);
// DONE
router.get("/service/:service", controller.service.GetPlansByService);

// new: DONE
router.post("/service/newservice", secured, controller.service.NewRecord);

// update: DONE
router.put("/service/updateservice", secured, controller.service.UpdateRecord);
// make public
module.exports = router;
