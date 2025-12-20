import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile:{
        type: String,  // cloudinary
        required: true

    },
    thumbnail:{
        type: String,  // cloudanary
        required: true

    },
    title:{
        type: String,  // need to put by user
        required: true
    },
    description:{
        type: String,  // need to put by user
        required: true
    },
    duration:{
        type: Number,  // need to put by user
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,  // need to put by user
        default: true,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User' // the  model should exists in database
    }

},{timestamps:true}); // for createdAt and updatedAt

videoSchema.plugin(mongooseAggregatePaginate); // mongoose middleware -> to add pagination feature to aggregate queries

export const Video = mongoose.model('Video', videoSchema);