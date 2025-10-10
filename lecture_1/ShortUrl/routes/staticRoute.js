const express = require("express");
const URL = require("../models/url");

const router = express.Router();

router.get("/", async(req, res) => {
    const allUSers = await URL.find({});
    res.render("home",{ urls:allUSers });
});

module.exports = router;