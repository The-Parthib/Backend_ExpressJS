const express = require("express");
const URL = require("../models/url");

const router = express.Router();

router.get("/", async(req, res) => {
    const allUSers = await URL.find({});
    res.render("home",{ urls: allUSers});
});

router.get("/signup", (req, res) => {
    res.render("signup");
})

module.exports = router;