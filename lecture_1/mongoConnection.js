const mongoose = require("mongoose");

async function mongoDBconnection(uri) {
    return mongoose.connect(uri)
}

module.exports = {
    mongoDBconnection,
}