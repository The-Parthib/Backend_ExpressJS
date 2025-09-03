const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
// router import
const userRouter = require("./routes/user");
//middlewares
const { logger } = require("./middlewares/logger");



// mongo connection
const { mongoDBconnection } = require("./mongoConnection");
const mongoUri = process.env.MONGO_URI;
mongoDBconnection(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error: ", err));



  
// middlewears
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this to parse JSON bodies
app.use(logger("log.txt"));



// Routes
app.use("/api/user", userRouter);



app.listen(PORT, () => console.log(`Server listening on port :${PORT}`));
