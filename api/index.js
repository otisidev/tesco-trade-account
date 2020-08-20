module.exports = (req, res) => {
    return res.json({
        message: "Welcome to api endpoint.",
        header: req.headers,
        ip: req.ip,
    });
};
