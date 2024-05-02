import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// import routes
import aboutUsRoutes from './routes/AboutUs.routes.js';
import footerRoutes from './routes/Footer.routes.js';
import courseRoutes from './routes/Course.routes.js';

// declare routes
app.use('/api/v1/aboutus', aboutUsRoutes);
app.use('/api/v1/footer', footerRoutes);
app.use('/api/v1/course', courseRoutes);

app.use(errorHandler);

app.get("/api/v1", (req, res) => {
    res.status(200).json("Hello World");
});

export default app;
