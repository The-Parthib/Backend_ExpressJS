const { getUser } = require("../services/authSession");

async function authUser(req,res,next) {
    console.log(req);
    const userUid = req.cookies?.session_id;
    if(!userUid) {
        return res.redirect("/auth/l");
    }

    const user = getUser(userUid);
    if (!user) {
        return res.redirect("/auth/l");
    }

    req.user = user;
    next();
}

module.exports = {
    authUser
}