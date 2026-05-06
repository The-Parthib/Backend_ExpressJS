import { Schema, model} from "mongoose";

const notesSchema = new Schema({
    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    }
})

const notesModel = model("Notes", notesSchema);

export default notesModel;