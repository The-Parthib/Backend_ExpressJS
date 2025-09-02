const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 3000;
require("dotenv").config();
// mongodb
const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => {
    console.log("Error from MongoDB : ", err);
  });

// schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

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

app.get("/users", async (req, res) => {
  // res.setHeader("X-myName", "Parthib Panja");
  const allDBusers = await User.find({})
  return res.json(allDBusers);
});

app.get("/api/users", async (req, res) => {
  const allUsers = await User.find({});
  const html = `
  <ul>
  ${allUsers
    .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
    .join("")}
  </ul>
  `;
  res.send(html);
});

app.post("/api/users", async (req, res) => {
  const body = req.body;
  console.log("Body", body);
  if (
    !body.first_name ||
    !body.last_name ||
    !body.gender ||
    !body.email ||
    !body.job_title
  ) {
    return res.status(400).send({ msg: "All fileds are required..!!" });
  }
  // users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.status(201).json({ status: "success", id: users.length + 1 });
  // });
  const response = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    gender: body.gender,
    email: body.email,
    jobTitle: body.job_title,
  });
  console.log("Response : ", response);
  return res.status(201).json({ msg: "Created User" });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    // console.log(id);
    const user = users.find((userl) => userl.id === id);
    if (!user) {
      return res.status(404).send({ error: "user not found" });
    }
    return res.json(user);
  })
  .patch((req, res) => {
    //Todo: update users with :id
    return res.status(501).json({ status: "pending" });
  })
  .delete((req, res) => {
    //Todo: update users  witrh :id
    return res.status(501).json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Server listening on port :${PORT}`));
