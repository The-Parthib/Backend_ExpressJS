const User = require("../models/user");

// fetch all users
async function handleAllusers(req, res) {
  const allDBusers = await User.find({});
  return res.json(allDBusers);
}

// fetch all users list in html view
async function handleListUsers(req, res) {
  const allUsers = await User.find({});
  const html = `
  <ul>
  ${allUsers
    .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
    .join("")}
  </ul>
  `;
  res.send(html);
}

// create new user or post a new user
async function handleCreateUsers(req, res) {
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
  return res.status(201).json({ msg: "Created User",id:response._id });
}

// fetch user by id
async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ error: "user not found" });
  }
  return res.json(user);
}

// update user by id
async function updateUserbyId(req, res) {
 const user = await User.findByIdAndUpdate(req.params.id, {
    lastName: "jhonka",
  });
  return res.status(201).json({ status: "updated", doc: user });
}

// delete user by id
async function deleteUserById(req,res) {
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json({status:"Deleted User"})
}

module.exports = {
  handleAllusers,
  handleListUsers,
  handleCreateUsers,
  getUserById,
  updateUserbyId,
  deleteUserById
};
