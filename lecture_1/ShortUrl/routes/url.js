const express = require('express');
const {handleGenerateNewShortUrl,handleRedirect, handleGetAnalytics} = require("../controllers/url")
const URL = require("../models/url")

const router = express.Router();


router.post("/", handleGenerateNewShortUrl)
router.get("/:id", handleRedirect);
router.get("/analytics/:id", handleGetAnalytics);

module.exports = router;