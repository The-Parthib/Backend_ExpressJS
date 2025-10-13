const mongoose = require("mongoose");

const authUserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
  },
  { timestamps: true }
);

const authModel = mongoose.model("authUser", authUserSchema);

module.exports = authModel;