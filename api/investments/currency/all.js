const { connect } = require("../../../mongodb");
const CS = require("../../../services/currency.services");

module.exports = async (req, res) => {
    await connect();
    const cb = await CS.endpoint.getCurrenies();
    return res.json(cb);
};
