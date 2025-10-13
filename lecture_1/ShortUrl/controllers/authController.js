const authUser = require("../models/authUsers");

async function handleSignup(req, res) {
  const { name, email, password } = req.body;
  await authUser.create({ name, email, password });
  //   return res.status(200).json({ message: "Signup Successful" });
  return res.render("home");
}


module.exports = { handleSignup };