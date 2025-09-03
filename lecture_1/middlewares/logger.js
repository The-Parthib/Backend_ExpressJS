const fs = require("fs");

function logger(fileName) {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `${new Date().toLocaleString()}: ${req.ip} : ${req.method} : ${
        req.path
      }\n`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = {logger}
