const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  payer: String,
  amount: Number,
  user:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;