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

app.get("/test", async (req, res) => {
  const allUSers = await URL.find({});
  return res.end(`
    <html>
    <head></head>
    <body>
    <ol>
    ${allUSers.map(
      (item) =>
        `<li>${item.shortId} - ${item.redirectUrl} - ${item.visitHistory.length} visits</li>`
    ).join("")}
    </ol>
    </body>
    </html>`);
});

app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));
