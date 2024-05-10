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

// import routes
const aboutUsRoutes = require('./routes/AboutUs.routes.js');
const footerRoutes = require('./routes/Footer.routes.js');
const courseRoutes = require('./routes/Course.routes.js');
const pricePlan = require('./routes/Price.routes.js');

// declare routes
app.use('/api/v1/aboutus', aboutUsRoutes);
app.use('/api/v1/footer', footerRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/price', pricePlan);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.status(200).json("Hello World");
});

module.exports = app;