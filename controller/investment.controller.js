const { api, PROPS_KEY } = require("../services/investment.service");
const CS = require("../services/currency.services");
const mailer = require("../services/mailing.service").mailingService;
const FDS = require("../services/fundPaymentType.service").fundPaymentTypeService;
const cardService = require("../services/creditCard.service").creditCardService;
const { request, response } = require("express");

module.exports.actions = {
    //get user investments
    getinvestment: async (req, res) => {
        const cb = await api.getInvestments(req.params.id);
        return res.json(cb);
    },
    // new investment
    newInvestment: async (req, res) => {
        const { amount, currencyId, userId, fundTarget, cardModel, percent } = req.body;

        const cb = await api.newInvestment(userId, amount, currencyId, fundTarget, percent, cardModel);
        // return failed message
        if (cb.status !== 200) return res.json(cb);

        // send mail here
        const message = `You made a transaction with the following details: <br/>
			<b>Amount: </b> ${Intl.NumberFormat("en-US", {
                currency: "USD",
                style: "currency",
            }).format(amount)} <br/>
			<b>Currency: </b> ${cb.doc.currency.name} <br/>
			<b>Type: </b> Fund <br/><br/>
			Note: This email is intended for <b>${cb.doc.user.email}</b>
			`;
        mailer.sendEmail(cb.doc.user.name, cb.doc.user.email, "New Account Fund Request", message, "Investment Fund Request");

        return res.json(cb);
    },
    // new currency
    newCurrency: async (req, res) => {
        const cb = await CS.endpoint.newCurrency(req.body);
        return res.json(cb);
    },
    // get list of currencies within the system
    getCurrency: async (req, res) => {
        const cb = await CS.endpoint.getCurrenies();
        return res.json(cb);
    },
    // new currency
    updateCurrency: async (req, res) => {
        const id = req.params.id;
        const cb = await CS.endpoint.updateCurrency(id, req.body);
        return res.json(cb);
    },
    // remove currency
    deleteCurrency: async (req, res) => {
        const cb = await CS.endpoint.deleteCurrency(req.params.id);
        return res.json(cb);
    },

    getDueInvestmentsForIncrease: async (req, res) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const cb = await api.getDueInvestmentsForIncrease(page, limit);
        return res.json(cb);
    },
    getTrialInvestment: async (req, res) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const cb = await api.GetTrailAccount(page, limit);
        return res.json(cb);
    },
    increaseCurrentBalance: async (req, res) => {
        const { id, amount } = req.body;
        const cb = await api.IncreaseCurrentBalance(id, amount);
        return res.json(cb);
    },
    closeInvestment: async (req, res) => {
        const cb = await api.closeInvestment(req.params.id);
        return res.json(cb);
    },
    SearchInvestment: async (req, res) => {
        try {
            const { keyword } = req.query;
            const cb = await api.SearchInvestment(keyword);
            return res.json(cb);
        } catch (err) {
            return res.json({
                status: 500,
                message: err.message,
            });
        }
    },
    UpdateCurrentBalance: async (req, res) => {
        try {
            const { id, currentBalance } = req.body;
            const cb = await api.UpdatePropFigure(id, currentBalance, PROPS_KEY.balance);
            return res.json(cb);
        } catch (err) {
            return res.json({
                status: 500,
                message: err.message,
            });
        }
    },
    UpdateInvestmentMade: async (req, res) => {
        try {
            const { id, investmentMade } = req.body;
            const cb = await api.UpdatePropFigure(id, investmentMade, PROPS_KEY.investmentMade);
            return res.json(cb);
        } catch (err) {
            return res.json({
                status: 500,
                message: err.message,
            });
        }
    },
    ReInvestment: async (req, res) => {
        try {
            const { id } = req.body;
            const cb = await api.ReInvestment(id);
            return res.json(cb);
        } catch (err) {
            return res.json({
                status: 500,
                message: err.message,
            });
        }
    },
    merge: async (req, res) => {
        // MERGE INVESTMENT
        const model = req.body;
        if (model.ids && model.service && model.percent && model.userId) {
            if (model.ids.length) {
                // fetch investment list
                const _investments = await api.GetInvestmentByIds(model.ids);
                if (_investments.docs.length) {
                    const _amount = _investments.docs.map((c) => c.investmentMade).reduce((x, y) => x + y);
                    const _currentBalance = _investments.docs.map((x) => x.currentBalance).reduce((i, j) => i + j);
                    const result = await api.mergeInvestment(model.userId, _amount, model.fundTarget, model.percent, _currentBalance, model.service);
                    await api.CloseInvestments(model.ids);
                    return res.json(result);
                }
            }
        }
        return res.json({
            status: 500,
            message: "Invalid investment selected!",
        });
    },
};
/**
 * Fund payment type
 */
module.exports.fundPaymentType = {
    // new type
    NewFundType: async (req, res) => {
        const cb = await FDS.NewPaymentType(req.body.name);
        return res.json(cb);
    },
    GetAll: async (req, res) => {
        const cb = await FDS.GetPaymentType();
        return res.json(cb);
    },
    UpdateExisting: async (req, res) => {
        // get values from request body
        const { id, name } = req.body;
        const cb = await FDS.UpdateFundType(id, name);
        return res.json(cb);
    },
};
/**
 * Credit cards
 */
module.exports.creditcard = {
    // new
    NewCard: async (req, res) => {
        const cb = await cardService.NewCreditCard(req.body, req.params.investment);
        return res.json(cb);
    },

    // get
    /** Get credit card list
     * @param {request} req request object
     * @param {response} res response object
     */
    Get: async (req, res) => {
        const page = parseInt(req.query["page"] || "1");
        const limit = parseInt(req.query["limit"] || "25");
        const cb = await cardService.GetCreditCards(page, limit);
        return res.json(cb);
    },
};
