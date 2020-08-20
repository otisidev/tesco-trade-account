const US = require("../../services/user.service");
const { connect } = require("../../mongodb");

module.exports = async (req, res) => {
    await connect();
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cb = await US.getUsers(page, limit);
    return res.json(cb);
};
