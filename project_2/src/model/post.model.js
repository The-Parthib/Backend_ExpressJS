import { Schema, model } from "mongoose";

const postSchema = new Schema({
    image: String,
    caption: String
})

const Post = model("Posts", postSchema);

export default Post;