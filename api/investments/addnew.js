const { connect } = require("../../mongodb");
const { api } = require("../../services/investment.service");
const { mailingService } = require("../../services/mailing.service");

module.exports = async (req, res) => {
    await connect();
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
    mailingService.sendEmail(cb.doc.user.name, cb.doc.user.email, "New Account Fund Request", message, "Investment Fund Request");

    return res.json(cb);
};
