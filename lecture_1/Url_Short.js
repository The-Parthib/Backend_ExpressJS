// ...existing code...
const express = require("express");
const urlRoute = require("./ShortUrl/routes/url");
require("dotenv").config();

const app = express();
const PORT = 8001;

const { mongoDBconnection } = require("./mongoConnection");
const URL = require("./ShortUrl/models/url");
const mongoUri = process.env.MONGO_URI;
mongoDBconnection(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error: ", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);


app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));
