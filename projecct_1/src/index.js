import mongoose from 'mongoose';
import { DB_NAME } from './constants';










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