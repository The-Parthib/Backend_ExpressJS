const http = require("http");
const fs = require("fs");

// const server = http.createServer((req,res)=>{
//     console.log(req.headers);
//     res.end("Hello from server");
// })
const server = http.createServer((req,res)=>{
    const log = `${new Date().toISOString()} : ${req.url} New Request\n`
    fs.appendFile("log.txt",log,(err,data)=>{
        switch (req.url) {
            case "/":
                res.end("HomePage")
                break;
            case "/about":
                res.end("I'm Parthib Panja");
                break;
        
            default:
                res.end("404 Page Note found")
                break;
        }
    })
})

server.listen(2004,"localhost",()=>console.log("Server Started..!!"))