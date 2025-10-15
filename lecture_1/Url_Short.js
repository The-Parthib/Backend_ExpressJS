const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");

const urlRoute = require("./ShortUrl/routes/url");
const staticRoute = require("./ShortUrl/routes/staticRoute");
const authRoute = require("./ShortUrl/routes/authRouter")
const { authUser } = require("./ShortUrl/middlewares/auth");

const app = express();
const PORT = 8001;

const { mongoDBconnection } = require("./mongoConnection");
// const URL = require("./ShortUrl/models/url");
const mongoUri = process.env.MONGO_URI;
mongoDBconnection(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error: ", err));


app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./ShortUrl/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// +++++++ routes +++++++++
app.use("/url",authUser, urlRoute);
app.use("/",staticRoute );
app.use("/auth",authRoute);

app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));
