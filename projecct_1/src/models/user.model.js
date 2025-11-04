import mongoose, {Schema, Types} from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true // optimizes searching -> list like DBMS searching
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        required:true,

    },
    coverImage:{
        type:String, // cloudinary url
    },
    watchHostory:[
        {
            type:Schema.Objects.OnjectId,
            ref:'Video'
        }
    ],
    password:{
        types:String,

    }
})

export const User = mongoose.model('User', userSchema);