const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.middleware.js");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Declare routes
app.use('/api/about-us', require('./routes/AboutUs.routes.js'))

app.use(errorHandler);

app.get("/", (req, res) => {
    res.status(200).json("Hello World");
});

module.exports = app;
