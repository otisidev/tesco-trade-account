const US = require("../../services/user.service");
const vm = require("../../services/utility.core/view.model.builder");
const { connect } = require("../../mongodb"); // mongodb connection setting  module

module.exports = async (req, res) => {
    // connect to db
    await connect();
    const cb = await US.getUser(req.query.id);
    return res.json({
        status: 200,
        message: "user found.",
        doc: vm.buildFullUserVm(cb),
    });
};
