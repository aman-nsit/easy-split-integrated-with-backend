const Bill = require("../models/bill");

const fetchBills = async (req, res) => {
  try{
    // Find the bills
    // console.log(req.user);
    const bills = await Bill.find({user : req.user._id});

    // Respond with them
    res.json({ bills });
  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
};

const fetchBill = async (req, res) => {
  try{
    const billId = req.params.id;

  // Find the bill using that id
  const bill = await Bill.findOne({_id : billId,user :req.user._id});

  // Respond with the bill
  res.json({ bill });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
  
};

const createBill = async (req, res) => {
  try{
    // Get the sent in data off request body
    const { payer, amount } = req.body;

    // Create a bill with it
    const bill = await Bill.create({
      payer,
      amount,
      user : 
      req.user._id,
    });

    // respond with the new bill
    res.json({ bill });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};

const updateBill = async (req, res) => {
  try{
    // Get the id off the url
    // console.log(req.body);
    // console.log(req.user);   // here user is attached by middleware by retrieve token from cookie
    const billId = req.params.id;

    // Get the data off the req body
    const { payer, amount } = req.body;

    // Find and update the record
    await Bill.findOneAndUpdate({_id:billId,user :req.user._id}, {
      payer,
      amount,
    });

    // Find updated bill
    const bill = await Bill.findById(billId);

    // Respond with it
    res.json({ bill });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};

const deleteBill = async (req, res) => {
  try{
    // get id off url
    //console.log(req);
    const billId = req.params.id;

    // Delete the record
    await Bill.deleteOne({ _id: billId ,user :req.user._id});

    // Respond
    res.json({ success: "Record deleted" });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};
const deleteBills = async (req, res) => {
  try{
    // get id off url
    // const billId = req.params.id;

    // Delete the record
    await Bill.deleteMany({user :req.user._id});
    // Respond
    res.json({ success: "All Record deleted" });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};
module.exports = {
  fetchBills,
  fetchBill,
  createBill,
  updateBill,
  deleteBill,
  deleteBills,
};