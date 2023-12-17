const mongoose = require("mongoose");

const groupBillSchema = new mongoose.Schema({
  payer: String,
  amount: Number,
  user:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
  } ,
  group:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "Group",
  } 
});

const groupBill = mongoose.model("groupBill", groupBillSchema);

module.exports = groupBill;