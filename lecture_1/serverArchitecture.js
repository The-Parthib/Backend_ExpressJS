const fs = require("fs");

// console.log(1);
// fs.writeFile("./text.txt","Hellkooo world\n",(err)=>{});
// console.log(2);
// console.log(3);

console.log(1);
fs.readFile("./text.txt", "utf-8",(err,result)=>{
    console.log(result);
});
console.log(2);
console.log(3);
