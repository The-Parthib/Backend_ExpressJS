import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express(); // initialize express app

// middlewares

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, // access-control-allow-credentials:true
}
// use = middlewares
app.use(cors(corsOptions));

// json configuration
app.use(express.json({limit: '20kb'})); // to parse the incoming requests with json payloads
app.use(express.urlencoded({ extended: true })); // to parse the incoming requests with urlencoded payloads eg: parthib%20panja
app.use(express.static("public")); // to serve static files such as images, css files, and javascript files on server
app.use(cookieParser()); // to parse the cookie header and populate req.cookies with an object keyed by the cookie names


// Routes imports
import userRoutes from "./routes/user.routes.js";

// Routes declaration | middlewares
app.use("/api/v1/users", userRoutes)
// http://localhost:8000/api/v1/users/register

export default app;
