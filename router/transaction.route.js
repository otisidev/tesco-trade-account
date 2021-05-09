const controller = require("../controller/transaction.controller");
const { statisticController } = require("../controller/statistic.controller");
const secured = require("../services/utility.core/verifyToken");
const route = require("express").Router();
const { appSetting } = require("../appsetting");

// new fund : tested
route.post("/f/new", secured, controller.fundAccountRequest);

// new withdraw  : tested
route.post("/w/new", secured, controller.accountWithdrawRequest);

// cancel transaction : tested
route.put("/:id/cancel", secured, controller.cancelTransaction);

//get user trans : tested
route.get("/:id", controller.getUserTransaction);

// pending fund : tested
route.get("/p/fund", controller.getPendingFundRequest);

// pending withdraw : tested
route.get("/p/withdraw", controller.getPendingWithdrawalRequest);

// approve fund : tested
route.put("/approve/f", secured, controller.approveFundRequest);

// approve withdraw :tested
route.put("/approve/w", secured, controller.approveWithdrawRequest);

// approve withdraw :tested
route.put("/review/payment/:id", controller.reviewTransaction);

route.post("/new/fund/topup", secured, controller.newFundTransaction);

// get statistics
route.get("/account/stats", (req, res) => {
	return res.json({
		today: appSetting.all.data.daily_transaction,
		activeInvestor: appSetting.all.data.active_investor,
		consultant: appSetting.all.data.consultant,
		accountCreated: appSetting.all.data.total_investment,
		status: 200,
		message: "Completed"
	});
});

// update
route.put("/acount/stats", (req, res) => {
	const { today, activeInvestor, consultant } = req.body;
	console.log(
		"Body: ",
		JSON.stringify({ today, activeInvestor, consultant }, null, 6)
	);
	appSetting.updateConstant(activeInvestor);
	appSetting.updateDailyTransaction(today);
	// appSetting.update(today);
	return res.json({
		today: appSetting.DAILYTRANSACTION,
		activeInvestor: appSetting.ACTIVEINVESTOR,
		consultant: appSetting.CONSULTANT
	});
});

/**
 * Application data and setting
 */
// GET
route.get("/app/setting", secured, controller.appSetting.GetApplicationSetting);

//PUT
route.put("/app/setting/data", secured, controller.appSetting.UpdateData);

//PUT
route.put("/app/setting", secured, controller.appSetting.UpdateSetting);

/**
 * Application statistics
 */
route.get("/app/statistics", statisticController.getAppStatictis);
// make public
module.exports = route;
