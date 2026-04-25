// The main purpose is to create the Server here

import express from "express";

const app = express();

// Middleware to parse JSON data from the request body 
app.use(express.json());

// NOTES to be added here 
const notes = []

// APIs
app.post("/data", (req, res) => {
    console.log(req.body);
    notes.push(req.body);
    return res.status(200).json({
        message: "Data received successfully",
        data: req.body
    })
})


app.get("/data", (req, res) => {
    return res.status(200).json({
        message: "Data received successfully",
        count: notes.length,
        data: notes
    })
})

app.delete("/data/:index", (req, res) => {
    const { index } = req.params;
    const note = delete notes[index];
    return res.status(200).json({
        message: "Data deleted successfully",
        remaining_data: notes.length,
        data: note
    })
})

app.patch("/data/:index",(req,res)=>{

    const idx = req.params.index;
    const description = req.body.Description;
    notes[idx].Description = description;

    return res.status(200).json({
        message: "Data updated successfully",
        data: notes[idx]
    })
})

app.get("/", (req, res) => {
    res.send(notes);
})

export default app; 