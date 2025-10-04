const { nanoid } = require("nanoid");
const URL = require("../models/url");
// const p = nanoid(8); //=> "Y0sR8lkb"
// console.log(p)

async function handleGenerateNewShortUrl(req, res) {
  const ShortId = nanoid(8);
  const body = req.body;
  console.log(body.url);
  if (!body.url) return res.status(400).json({ Error: "Please put an URL" });
  await URL.create({
    shortId: ShortId,
    redirectUrl: body.url,
    visitHistory: [],
  });

  return res.status(200).json({ ID: ShortId });
}

async function handleRedirect(req, res) {
  const id = req.params.id;
  const entry = await URL.findOneAndUpdate(
    { shortId: id },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  return res.redirect(entry.redirectUrl);
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.id;
  const result = await URL.findOne({ shortId });
  return res
    .status(200)
    .json({
      "Total Visit": result.visitHistory.length,
      "Visit History": result.visitHistory,
    });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleRedirect,
  handleGetAnalytics,
};
