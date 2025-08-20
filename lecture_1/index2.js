const http = require("http");
const fs = require("fs");
const url = require("url")

// const server = http.createServer((req,res)=>{
//     console.log(req.headers);
//     res.end("Hello from server");
// })
const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return res.end();
  const log = `${new Date().toISOString()} : ${req.url} New Request\n`;
  const myUrl = url.parse(req.url,true);
  console.log(myUrl)
  fs.appendFile("log.txt", log, (err, data) => {
    switch (myUrl.pathname) {
      case "/":
        res.end("HomePage");
        break;
      case "/about":
        const user = myUrl.query.name
        res.end(`Hii, ${user}`);
        break;

      case "/search":
        const serach = myUrl.query.search_q
        res.end("Here is the result for "+serach)
        break;

      default:
        res.end("404 Page Note found");
        break;
    }
  });
});

server.listen(2004, "localhost", () => console.log("Server Started..!!"));
