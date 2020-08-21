const controller = require("../controller/investment.controller");
const routes = require("express").Router();
const secured = require("../services/utility.core/verifyToken");

// get : DONE
routes.get("/:id", controller.actions.getinvestment);

// new investment: DONE
routes.post("/addnew", controller.actions.newInvestment);

// new currency: DONE
routes.post("/currency/new", secured, controller.actions.newCurrency);

// get currency: DONE
routes.get("/currency/all", controller.actions.getCurrency);

//update currency: DONE
routes.put("/currency/:id/update", secured, controller.actions.updateCurrency);

//increase currency: DONE
routes.put("/credit/account", secured, controller.actions.increaseCurrentBalance);

// get Investments Due For Increase: DONE
routes.get("/due/increase", secured, controller.actions.getDueInvestmentsForIncrease);

// get trail investment: DONE
routes.get("/trail/account", secured, controller.actions.getTrialInvestment);

// get search for investment: DONE
routes.get("/user/search", secured, controller.actions.SearchInvestment);

// POST: update current balance: DONE
routes.post("/u/balance", secured, controller.actions.UpdateCurrentBalance);

// POST update investment: DONE
routes.post("/u/investment", secured, controller.actions.UpdateInvestmentMade);

// POST update investment: DONE
routes.post("/reinvest", secured, controller.actions.ReInvestment);

//remove currency: DONE
routes.delete("/currency/:id/remove", secured, controller.actions.deleteCurrency);

//remove currency: DONE
routes.put("/:id/close", secured, controller.actions.closeInvestment);
/**
 * Fund payment type
 */
// new fund type: DONE
routes.post("/fundpayment/create", secured, controller.fundPaymentType.NewFundType);

// update: DONE
routes.put("/fundpayment/update-existing", secured, controller.fundPaymentType.UpdateExisting);

// get all: DONE
routes.get("/fundpayment/all", controller.fundPaymentType.GetAll);

/**
 * CREDIT CARDS: DONE
 */
routes.post("/card/:investment", secured, controller.creditcard.NewCard);
// DONE
routes.get("/card/all", secured, controller.creditcard.Get);
// make public
module.exports = routes;
