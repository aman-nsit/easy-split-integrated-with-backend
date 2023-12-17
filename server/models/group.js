const mongoose = require("mongoose");
const User = require("./user"); // Import User schema
const Bill = require("./bill"); // Import Bill schema

const groupSchema = new mongoose.Schema({
  group_name: String,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  bills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill"
  }], 
  group_admin: String , 
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
