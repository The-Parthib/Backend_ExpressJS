// this service is made to handle authentication sessions

// we will make a diary of sessions in memory
// userId -> sessionId

const sessionIdMap = new Map(); // hashMap

function setUser(id,user) {
    sessionIdMap.set(id,user);
}

function getUser(id) {
    return sessionIdMap.get(id);
}

module.exports = { setUser, getUser };