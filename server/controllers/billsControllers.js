const Bill = require("../models/bill");
const Group = require("../models/group");
const User = require("../models/user");
const billCalculator = require("../service/service");
const fetchBills = async (req, res) => {
  try{
    console.log(req.params.groupId)
    const group = await Group.findOne({_id : req.params.groupId}).populate('bills');
    if(!group){
      return res.status(400).json({"message": "Group Not Found"});
    }
    if(group.users.indexOf(req.user._id)===-1){
      return res.status(400).json({"message": "User Not Linked To This Group"});
    }
    res.json(group.bills);
  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
};

const fetchBill = async (req, res) => {
  try{
    const billId = req.params.id;
    const bill = await Bill.findOne({_id : billId,user :req.user._id});
    res.json({ bill });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};
const createBill = async (req, res) => {
  try{
    const { userId, amount } = req.body;
    const group = await Group.findById(req.params.groupId);
    const payer_details = await User.findById(userId);
    // console.log(group);
    if(!group){
      return res.status(400).json({"message": "Group Not Found"});
    }
    // console.log(payer_details);
    if(!payer_details){
      return res.status(400).json({"message": "Payer Not Registered"});
    }
    if(group.users.indexOf(payer_details._id) === -1){
      return res.status(400).json({"message": "Payer Not Linked To This Group"});
    }
    const bill = await Bill.create({
      payer : payer_details.user_name,
      amount,
      addedBy: req.user._id , 
      payer_id : payer_details._id,
      group : group._id
    });
    group.bills.push(bill._id);
    await group.save();
    res.json({ bill , group});
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};

const updateBill = async (req, res) => {
  try{
   
    const {billId ,groupId } = req.params;
    const group = await Group.findById(groupId);
    if(!group){
      return res.status(400).json({"message": "Group Not Found"});
    }
    if(group.users.indexOf(req.user._id)===-1){
      return res.status(400).json({"message": "User Not Linked To This Group"});
    }
    const { userId, amount } = req.body;

    // Find and update the record
    const bill = await Bill.findById(billId);
    if(!bill){
      return res.status(400).json({"message": "This user has not any bill registered in this group"});
    }
    if(group.bills.indexOf(billId)===-1){
      return res.status(400).json({"message": "This bill not Linked To This Group"});
    }
    bill.amount+=amount;
    bill.save();
    // Respond with it
    res.json({ bill });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};

const deleteBill = async (req, res) => {
  try{
    const { billId ,groupId } = req.params;
    const group = await Group.findOne({_id : groupId});
    if(!group){
      return res.status(400).json({"message": "Group Not Found"});
    }
    if(group.users.indexOf(req.user._id)===-1){
      return res.status(400).json({"message": "User Not Linked To This Group"});
    }
    // check bill is is part of group or not .
    const ind = group.bills.indexOf(billId) ;
    if(ind===-1){
        return res.status(404).json({ message: 'Bill To remove is not a Related to this group' });
    }
    group.bills.splice(ind,1);
    await group.save();
    await Bill.deleteOne({ _id: billId });
    // Respond
    res.json({ success: "Record deleted" });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};
const deleteBills = async (req, res) => {
  try{
    const groupId = req.params.groupId;
    const group = await Group.findOne({_id : groupId});
    if(!group){
      return res.status(400).json({"message": "Group Not Found"});
    }
    if(group.users.indexOf(req.user._id)===-1){
      return res.status(400).json({"message": "User Not Linked To This Group"});
    }
    // Delete the record
    await Bill.deleteMany({_id :{ $in : group.bills}});
    group.bills=[];
    await group.save();
    // Respond
    res.json({ success: "All Bill Records deleted successfully" });
  }catch(err){
    console.log(err); 
    res.sendStatus(400);
  }
};

const splitBills = async (req, res) => {
  try{
    const group = await Group.findById(req.params.groupId).populate( 
      {path:'bills',select:'payer amount'}).populate(
        {path:'users',select : '_id user_name'}
      );
    if(!group){
      return res.status(400).json({"message": "Group Not Found"});
    }
    let user = group.users.filter((user)=> user==req.user._id)
    if(!user){
      return res.status(400).json({"message": "User Not Linked To This Group"});
    }
    let bills=group.bills;
    let trans =[];
    for(let user of group.users){
        if(user.user_name)trans.push({payer:user.user_name,amount:0});
    }
    let total_expense = 0;
    bills.forEach((bill)=>{
      let existingPayer = trans.find(user => bill.payer === user.payer);

      if (existingPayer) {
          existingPayer.amount += bill.amount;
      } else {
          trans.push({ payer: bill.payer, amount: bill.amount });
      }
      total_expense+=bill.amount;
    });
    let splittedBills = billCalculator(trans,total_expense);
    // console.log(splittedBills);
    res.json(splittedBills);
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
  splitBills
};