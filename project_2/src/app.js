// The main purpose is to create the Server here

import express from "express";
import notesModel from "./model/notes.model.js";

const app = express();

// Middleware to parse JSON data from the request body 
app.use(express.json());



// APIs
app.post("/note", async (req, res) => {
    console.log(req.body);
    const data = req.body;
    
    await notesModel.create({
        title : data.title,
        description : data.Description
    });

    return res.status(200).json({
        message: "Data received successfully",
        data: req.body
    })
})

app.get("/notes", async(req, res) => {
    const notes = await notesModel.find();
    return res.status(200).json({
        message: "Notes fetched successfully",
        data: notes
    })
})

app.delete("/note/:id", async (req, res) => {
    const id = req.params.id;
    
    await notesModel.findByIdAndDelete({
        _id : id    
    })
    
    res.status(200).json({
        message: "Note deleted successfully",
    })
})

app.patch("/note/:id", async(req,res)=>{
    const id = req.params.id;
    const description = req.body.description;
    
    await notesModel.findByIdAndUpdate({_id : id},{ description : description});

    res.status(200).json({
        message: "Data updated successfully",
    })
})

app.get("/", (req, res) => {
    res.send(notes);
})

export default app; 