import exprerss from "express";
const app = exprerss();

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

app.get("/",(req,res)=>{
    res.send("Hello World");
});