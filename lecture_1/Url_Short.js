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
app.get("/:id", async (req, res) => {
    const shortId = req.params.id;
    console.log('Incoming shortId:', shortId); // debug

    try {
        // debug: try a simple find first
        const found = await URL.findOne({ shortId }).lean();
        console.log('DB findOne result:', found);

        if (!found) {
            return res.status(404).json({ error: "Short ID not found" });
        }

        // push visit and redirect (separate update so debugging is clearer)
        await URL.updateOne(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } }
        );

        return res.redirect(found.redirectUrl);
    } catch (err) {
        console.error("Redirect error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));
