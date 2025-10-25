// this service is made to handle authentication sessions

// we will make a diary of sessions in memory
// userId -> sessionId

// const sessionIdMap = new Map(); // hashMap

const jwt = require("jsonwebtoken");
const secret = "humanity";



function setUser(user) {
    // sessionIdMap.set(id,user); // if we use hashmap
    return jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email
    }, secret);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = { setUser, getUser };