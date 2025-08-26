const express = require("express");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 3000;

app.get("/home", (req, res) => {
  res.send("hello rest app go to /users");
});

app.get("/users", (req, res) => {
  return res.json(users);
});

// app.get("/api/users", (req, res) => {
//   const html = `
//   <ul>
//   ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
//   </ul>
//   `;
//   res.send(html);
// });

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const user = users.find((userl) => userl.id === id);
  return res.json(user);
});

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
