const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  payer: String,
  amount: Number,
  addedBy:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
  } ,
  payer_id:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
  } ,
  group:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "Group",
  } 
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;