// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/MongoDB.js";
import app from "./app.js";

dotenv.config({
  path: "../.env",
});
// as connectDB is a async function we can use thennable method to start the server only after successful connection to the database
connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(err);
      throw err;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`※ Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:: index.js ", err);
  });

/*
// Approach No 1: Using IIFE (Immediately Invoked Function Expression) to connect to MongoDB and start the server
import express from 'express';
const app = express();

// IFE immediate function execute

( async () => { 
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,)
       app.on('error', (err) => {
        console.error("Error: ", err);
        throw err;
       });

       app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
       });
    }
    catch(error){
        console.error("ERROR: ", error);
        throw error;
    }
 })()

*/
