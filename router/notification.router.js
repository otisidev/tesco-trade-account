const router = require("express").Router();
const controller = require("../controller/notification.controller");

// define router
router.get("/:id", controller.getNotify);

// mark as seen
router.put("/:id/seen", controller.markAsSeen);

// make public
module.exports = router;
