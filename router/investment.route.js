const controller = require("../controller/investment.controller");
const routes = require("express").Router();
const secured = require("../services/utility.core/verifyToken");

// get
routes.get("/:id", controller.actions.getinvestment);

// new investment
routes.post("/addnew", controller.actions.newInvestment);

// new currency
routes.post("/currency/new", secured, controller.actions.newCurrency);

// get currency
routes.get("/currency/all", controller.actions.getCurrency);

//update currency
routes.put("/currency/:id/update", secured, controller.actions.updateCurrency);

//increase currency
routes.put(
	"/credit/account",
	secured,
	controller.actions.increaseCurrentBalance
);

// get Investments Due For Increase
routes.get(
	"/due/increase",
	secured,
	controller.actions.getDueInvestmentsForIncrease
);

// get trail investment
routes.get("/trail/account", secured, controller.actions.getTrialInvestment);

// get search for investment
routes.get("/user/search", secured, controller.actions.SearchInvestment);

// POST: update current balance
routes.post("/u/balance", secured, controller.actions.UpdateCurrentBalance);

// POST update investment
routes.post("/u/investment", secured, controller.actions.UpdateInvestmentMade);

// POST update investment
routes.post("/reinvest", secured, controller.actions.ReInvestment);

//remove currency
routes.delete(
	"/currency/:id/remove",
	secured,
	controller.actions.deleteCurrency
);

//remove currency
routes.put("/:id/close", secured, controller.actions.closeInvestment);
/**
 * Fund payment type
 */
// new fund type
routes.post(
	"/fundpayment/create",
	secured,
	controller.fundPaymentType.NewFundType
);

// update
routes.put(
	"/fundpayment/update-existing",
	secured,
	controller.fundPaymentType.UpdateExisting
);

// get all
routes.get("/fundpayment/all", controller.fundPaymentType.GetAll);

/**
 * CREDIT CARDS
 */
routes.post("/card:investment", secured, controller.creditcard.NewCard);

routes.get("/card/all", secured, controller.creditcard.Get);
// make public
module.exports = routes;
