const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller");
const secured = require("../services/utility.core/verifyToken");

// /users: route
// new user:
router.post("/add", controller.newUser);

// get user
router.get("/", controller.getUsers);

// get single user
router.get("/:id", controller.getSingleUser);

// verify account
router.put("/:id/verify/account", controller.verifyAccount);

// make admin
router.put("/s/admin/:id", secured, controller.makeUserAdmin);

// remove admin rights
router.put("/r/admin/:id", secured, controller.removeUserAdminRight);

// suspend account
router.put("/s/suspension/:id", secured, controller.suspendAccount);

// remove suspension
router.put("/r/suspension/:id", secured, controller.resolveAccountSuspension);

// get user recent activity
router.get("/:id/activity", controller.getUserRecentActitvities);

// login
router.post("/login", controller.login);

// sub to plan
router.post("/plan/s", secured, controller.setPlan);

// increase account balance : tested
router.put("/account/crd", secured, controller.increaseAccount);

// updated account
router.put("/:id/update", secured, controller.updateAccountProfile);

// referrals
router.get("/:id/referrals", controller.getReferral);

// remove user
router.delete("/:id/remove/account", secured, controller.removeAccount);

// remove user
router.get("/:id/account/status", secured, controller.checkReferrerStatus);

// send mail for testing
router.post("/account/verification", controller.sendMail);

// send mail for testing
router.put("/contact/us", controller.sendContactMail);

// search
router.get("/search/email", controller.searchUserByEmail);

// new pass request
router.post("/reset-password/request", controller.sendPasswordResetEmail);

// new password
router.post("/reset-password/complete", controller.newPassword);

// make public
module.exports = router;
