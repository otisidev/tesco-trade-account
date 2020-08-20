const US = require("../../services/user.service");
const MS = require("../../services/mailing.service").mailingService;
const vm = require("../../services/utility.core/view.model.builder");
const utility = require("../../services/utility.core/utility");
const { connect } = require("../../mongodb"); // mongodb connection setting  module

module.exports = async (req, res) => {
    try {
        // connect db
        await connect();
        // get user model from req body
        const user = req.body;
        const referrer = req.body.ref || req.query.ref;

        // hash password
        const pwd = await utility.hash(user.password);

        if (pwd) {
            // add user
            user.password = pwd;
            const account = await US.addUser(user, referrer);
            if (account.status === 200) {
                // send mail
                MS.sendConfirmEmail(account.doc._id, account.doc.email, account.doc.name);
                // return new user object
                return res.json({
                    status: 200,
                    message: account.message,
                    doc: vm.buildFullUserVm(account.doc),
                });
            } else {
                return res.json(account);
            }
        }
        return res.json({
            status: 404,
            message: "Unable to create new account! Confirm all properties and try again.",
        });
    } catch (err) {
        return res.json({
            status: 500,
            message: err.message,
        });
    }
};
