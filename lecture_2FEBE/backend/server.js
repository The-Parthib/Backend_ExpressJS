import express from "express";
const app = express();
const port = process.env.PORT || 3000;

// app.use(express.static('dist'))  // for distribution folfer after build command

app.get("/", (req, res) => {
  res.send("server is ready");
});

app.get("/api/jokes",(req,res) => { 
  const jokes = [
    {
      id:1,
      title: 'A joke',
      content: 'This is a  joke'
    },
    {
      id:2,
      title: 'A 2nd joke',
      content: 'This is a second joke'
    },
    {
      id:3,
      title: 'A 3rd joke',
      content: 'This is a third joke'
    },
    {
      id:4,
      title: 'A 4th joke',
      content: 'This is a fourth joke'
    },
    {
      id:5,
      title: 'A 5th joke',
      content: 'This is a fifth joke'
    },
  ]
  res.send(jokes);
 })


app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
