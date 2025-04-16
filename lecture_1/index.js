require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const github = {
  login: "The-Parthib",
  id: 137101311,
  node_id: "U_kgDOCCv__w",
  avatar_url: "https://avatars.githubusercontent.com/u/137101311?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/The-Parthib",
  html_url: "https://github.com/The-Parthib",
  followers_url: "https://api.github.com/users/The-Parthib/followers",
  following_url:
    "https://api.github.com/users/The-Parthib/following{/other_user}",
  gists_url: "https://api.github.com/users/The-Parthib/gists{/gist_id}",
  starred_url:
    "https://api.github.com/users/The-Parthib/starred{/owner}{/repo}",
  subscriptions_url: "https://api.github.com/users/The-Parthib/subscriptions",
  organizations_url: "https://api.github.com/users/The-Parthib/orgs",
  repos_url: "https://api.github.com/users/The-Parthib/repos",
  events_url: "https://api.github.com/users/The-Parthib/events{/privacy}",
  received_events_url:
    "https://api.github.com/users/The-Parthib/received_events",
  type: "User",
  user_view_type: "public",
  site_admin: false,
  name: "The-Parthib",
  company: null,
  blog: "",
  location: null,
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: 16,
  public_gists: 0,
  followers: 4,
  following: 3,
  created_at: "2023-06-19T17:31:41Z",
  updated_at: "2025-03-10T09:36:18Z",
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/new", (req, res) => {
  res.send("Hello I'm a new Express User..!!");
});

app.get("/user", (req, res) => {
  res.send("<h1>Parthib and Rupsa</h1>");
});

app.get("/rupsa", (req, res) => {
  res.send("<h1>Hii I'm Rupsa Chatterjee(Panja)</h1>");
});
app.get("/parthib", (req, res) => {
  res.send("<h1>Hii I'm Parthib Panja</h1>");
});

app.get("/github", (req, res) => {
  res.json(github);
});
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
