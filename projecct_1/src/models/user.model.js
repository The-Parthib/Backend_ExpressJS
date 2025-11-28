import mongoose, { Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // used for hashing password

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // optimizes searching -> list like DBMS searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.OnjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"], // custom error message
    },
    refreshTocken: {
      type: String,
    },
  },
  { timestamps: true }
);

// mongoose middleware -> to hash password before saving user document
userSchema.pre("save", async function (next) {
  //just to make sure it will execute only when passwprd has been changed or is new
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hash(this.password, 10); // 10 -> salt rounds, higher the rounds more secure but slower
  next();
});

export const User = mongoose.model("User", userSchema);
