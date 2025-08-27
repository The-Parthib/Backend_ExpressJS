const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs")
const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended:false}));

app.get("/home", (req, res) => {
  res.send("hello rest app go to /users");
});

app.get("/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users", (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});

app.post("/api/users",(req,res)=>{
  const body = req.body;
  console.log("Body",body);
  users.push({...body,"id":users.length+1})
  fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
    return res.json({"status":"success",id:users.length+1});
  })
})

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    // console.log(id);
    const user = users.find((userl) => userl.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    //Todo: update users with :id
    return res.json({"status":"pending"})
  })
  .delete((req, res) => {
    //Todo: update users  witrh :id
    return res.json({"status":"pending"})
  });

app.listen(PORT, () => console.log(`Server listening on port :${PORT}`));
