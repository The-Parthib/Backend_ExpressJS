const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 3000;

// middlewears
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this to parse JSON bodies

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${new Date().toLocaleString()}: ${req.ip} : ${req.method} : ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});

// Routes
app.get("/home", (req, res) => {
  console.log("from get/home route", req.myUsername);
  res.send(`hello rest app go to /users ${req.myUsername}`);
});

app.get("/users", (req, res) => {
  res.setHeader("X-myName","Parthib Panja")
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

app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log("Body", body);
  if (!body.first_name || !body.last_name || !body.gender || !body.email || !body.job_title) {
    return res.status(400).send({msg:"All fileds are required..!!"})
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "success", id: users.length + 1 });
  });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    // console.log(id);
    const user = users.find((userl) => userl.id === id);
    if (!user) {
      return res.status(404).send({error:"user not found"})
    }
    return res.json(user);
  })
  .patch((req, res) => {
    //Todo: update users with :id
    return res.status(501).json({ status: "pending" })
  })
  .delete((req, res) => {
    //Todo: update users  witrh :id
    return res.status(501).json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Server listening on port :${PORT}`));
