// const { v4: uuidv4 } = require("uuid");

const authUser = require("../models/authUsers");
const { setUser } = require("../services/authSession");

async function handleSignup(req, res) {
  const { name, email, password } = req.body;
  await authUser.create({ name, email, password });
  //   return res.status(200).json({ message: "Signup Successful" });
  return res.redirect("/");
}

async function handleLogin(req, res) {
  const { email, password } = req.body;
  const user = await authUser.findOne({ email, password }); // Fixed: Use authUser instead of URL
  console.log(user);

  if (!user) {
    return res.render("login", { error: "Invalid email or password" }); // Added return to prevent further execution
  }

//setUser(sessionId, user);

  const token = setUser(user);
  res.cookie("session_id", token);

  return res.redirect("/"); // This now only executes if user exists
}

module.exports = { handleSignup, handleLogin };
