
const { nanoid } = require('nanoid');
const URL = require('../models/url');
// const p = nanoid(8); //=> "Y0sR8lkb"
// console.log(p)
async function handleGenerateNewShortUrl(req,res) {
    const ShortId = nanoid(8);
    const body = req.body;
    // console.log(body.url);
    if(!body.url) return res.status(400).json({"Error": "Please put an URL"})
    await URL.create({
        shortId:ShortId,
        redirectUrl:body.url,
        visitHistory:[]
    })

    return res.status(200).json({"ID": ShortId})
}

// async function handleRedirect(req,res) {
    
// }

module.exports = {handleGenerateNewShortUrl}