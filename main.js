"use strict";
const express = require("express"); // express module
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express(); // new express server instance
const db = require("./mongodb"); // mongodb connection setting  module
const path = require("path");
const http = require("http");
const winston = require("winston");
const ew = require("express-winston");

// Socket
const { Socket } = require("./socket"); // socket-io class module

/**
 * Winston Logging
 */
const logger = ew.logger({
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/access.log",
            level: "error",
        }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    // msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
        return false;
    },
});

// apply logger
app.use(logger);

// start db
db.connect();

//CORS
app.use(cors());

// router
const userRouter = require("./router/user.router");
const notifyRouter = require("./router/notification.router");
const planRouter = require("./router/plan.router");
const transactionRoute = require("./router/transaction.route");
const investmentRoute = require("./router/investment.route");

// disable x-powered-by
app.disable("x-powered-by");

// use middle-wares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PORT
const PORT = process.env.PORT || 8087;

// use router here
app.use("/api/users", userRouter);
app.use("/api/notification", notifyRouter);
app.use("/api/plans", planRouter);
app.use("/api/transactions", transactionRoute);
app.use("/api/investments", investmentRoute);

// use  static resources
app.use(express.static(path.join(__dirname, "public")));

//
app.get("/api", (req, res) => {
    // req.headers
    return res.json({
        message: "Welcome to api endpoint.",
        header: req.headers,
        ip: req.ip,
    });
});
// catch every other request and return index file
app.get("*", (req, res) => {
    return res.sendFile(path.join(__dirname, "public/index.html"));
});

// error logger
app.use((err, req, res, next) => {
    return res.json({
        status: 500,
        message: err.message,
    });
});

const server = http.Server(app);

// start listen
server.listen(PORT, () => {
    console.log(`server started! Listening on Port ${PORT}`);
    // socket
    // create new instance of socket provider
    const socket = new Socket(server);
    socket.userGroup(); // start listening to user group
    socket.transactionGroup(); // start listening to transaction group
    socket.appGroup(); // start listening to application  notification group
    socket.cardGroup(); // credit card group
});
