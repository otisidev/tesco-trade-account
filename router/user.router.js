const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller");
const secured = require("../services/utility.core/verifyToken");

// /users: route
// new user: DONE
router.post("/add", controller.newUser);

// get user: DONE
router.get("/", controller.getUsers);

// get single user: DONE
router.get("/:id", controller.getSingleUser);

// verify account: DONE
router.put("/:id/verify/account", controller.verifyAccount);

// make admin: DONE
router.put("/s/admin/:id", secured, controller.makeUserAdmin);

// remove admin rights: DONE
router.put("/r/admin/:id", secured, controller.removeUserAdminRight);

// suspend account: DONE
router.put("/s/suspension/:id", secured, controller.suspendAccount);

// remove suspension: DONE
router.put("/r/suspension/:id", secured, controller.resolveAccountSuspension);

// get user recent activity: DONE
router.get("/:id/activity", controller.getUserRecentActitvities);

// login: DONE
router.post("/login", controller.login);

// sub to plan: DONE
router.post("/plan/s", secured, controller.setPlan);

// increase account balance : tested: DONE
router.put("/account/crd", secured, controller.increaseAccount);

// updated account:DONE
router.put("/:id/update", secured, controller.updateAccountProfile);

// referrals: DONE
router.get("/:id/referrals", controller.getReferral);

// remove user: DONE
router.delete("/:id/remove/account", secured, controller.removeAccount);

// remove user: DONE
router.get("/:id/account/status", secured, controller.checkReferrerStatus);

// send mail for testing: DONE
router.post("/account/verification", controller.sendMail);

// send mail for testing: DONE
router.put("/contact/us", controller.sendContactMail);

// search: DONE
router.get("/search/email", controller.searchUserByEmail);

// new pass request: DONE
router.post("/reset-password/request", controller.sendPasswordResetEmail);

// new password: DONE
router.post("/reset-password/complete", controller.newPassword);

// make public
module.exports = router;
