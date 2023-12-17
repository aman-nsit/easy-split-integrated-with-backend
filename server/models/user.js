const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  } ,
  user_name:{
    type: String,
    required: true,
    lowercase: true,
  } ,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  bills : [{type:mongoose.Schema.Types.ObjectId , ref : "Bill"}], 
  joined_groups : [{type:mongoose.Schema.Types.ObjectId , ref : "Group"}]
});

const User = mongoose.model("User", userSchema);

module.exports = User;