const express = require("express");
// const http = require("http");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Home Page..!!");
});
app.get("/about", (req, res) => {
  res.send("Welcome to about Page..!!\n Searched about " + req.query.about);
});
app.get("/contact", (req, res) => {
  res.send(
    "Welcome to Contact Page..!!\n" +
      "hii " +
      req.query?.name +
      " please wait..!"
  );
});

app.listen(3000, () => {
  console.log("server listening at : localhost:3000");
});

// const server = http.createServer(app);
// server.listen(3000, "localhost", () =>
//   console.log("Server listening at localhost:3000 ")
// );
