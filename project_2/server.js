// USED to start the server

import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import connectDB from "./src/db/MongoDb.js";
const PORT = 8000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});
