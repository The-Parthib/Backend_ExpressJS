import mongoose from "mongoose";

async function connectDB(){
    await mongoose.connect("mongodb+srv://rijupanja81_db_user:FpTla5IXs7b7Dpmd@sheriyansbackend.iz2kn8k.mongodb.net/NotesApp?appName=sheriyansBackend");
    console.log("MongoDB connected");
}

export default connectDB; 