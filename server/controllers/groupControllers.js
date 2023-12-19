const Group = require("../models/group");
const User = require("../models/user");
const Bill = require("../models/bill");
const createGroup = async (req, res) => {
    try{

        const group_name = req.body.group_name;
        const users = req.body.users;
        users.push(req.user._id);
        console.log(users);
        console.log(group_name);
        const bills = [];
        const group_admin = req.user._id;
        const group = await Group.create({
          group_name,
          users,
          bills,
          group_admin
      });
        const filter_by_id = { _id: { $in: users } }; 
        const update = { $addToSet: { joined_groups: group._id } }; 

        const result = await User.updateMany(filter_by_id, update);
        
        res.json(group);
    }
    catch(err){
        res.sendStatus(400);
        console.log(err);
    }
}
const addMember = async(req,res) =>{
    try{
        const {email , username} = req.body;
        const group_id = req.params.groupId;
        // console.log(group_id);
        const user_to_find = await User.findOneAndUpdate(
          {email},
          { $addToSet: { joined_groups: group_id } },
          { new: true });
        const group_temp = await Group.findById(group_id);
        // console.log(group_temp);
        if(!user_to_find ){
            return res.status(500).json({message:"Username and email Not Found"});
        }
        if(req.user._id!=group_temp.group_admin){
            return res.status(403).json({message:"Only Admin can add member in Group "});
        }
        // console.log(user_to_find);
        
        const group = await Group.findByIdAndUpdate(
            group_id,
            { $addToSet: { users: user_to_find._id } }, // Using $addToSet to add user only if not already present
            { new: true });
        // add group info in user schema also.
        await User.findByIdAndUpdate(
              user_to_find._id,
              { $addToSet: { joined_groups: group_id } }, // Using $addToSet to add user only if not already present
              { new: true });

        res.json({group});
    }
    catch(err){
        res.sendStatus(400);
        console.log(err);
    }

}
const joinGroup = async(req,res) => {
    try{
        const group_id = req.params.groupId;
        const group_details = await Group.findOneAndUpdate(
            {_id : group_id},
            { $addToSet: { users: req.user._id } }, // Using $addToSet to add user only if not already present
            { new: true }
        );
        User.findByIdAndUpdate(
          {_id:req.user._id},
          { $addToSet: { joined_groups: group_id } }, // Using $addToSet to add user only if not already present
          { new: true }
        );
        
        res.json({group_details});
    }
    catch(err){
        res.status(400).json({message:"Group Not Found"});
        console.log(err);
    }
}

const fetchGroupsName = async (req, res) => {
    try {
      const groups = await Group.find({}, 'group_name ,  _id'); 
      res.json({ groups });
    } catch (error) {
      res.status(500).json({ message: 'Error in fetching groups' });
      console.error(error);
    }
  };

  const removeGroup = async (req,res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user._id; 
        const group = await Group.findById(groupId);
        // console.log(group)
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        
        // Check if the user making the request is the group admin
        if (group.group_admin.toString() !== userId.toString()) {
          return res.status(403).json({ message: 'Unauthorized: Only group admin can delete the group' });
        }

        await Bill.deleteMany({ _id: { $in: group.bills } });
        await User.updateMany(
          { _id: { $in:group.users } }, 
          { $pull: { joinedGroup: group._id } },
        )
        await Group.findByIdAndDelete(group._id);
        res.json({ message: 'Group deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting group' });
        console.error(error);
      }
  } 
  const removeMemberFromGroup = async (req,res) =>{
    try {
        const  email_user_to_remove   = req.params.memberEmail;
        const groupName =req.params.groupName;
        const requestingUserId = req.user._id; // Assuming authentication middleware
        const group = await Group.findOne({group_name: groupName });
    
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
    
        if (group.group_admin.toString() !== requestingUserId.toString()) {
          return res.status(403).json({ message: 'Unauthorized: Only group admin can remove members' });
        }
        const userToRemove = await User.findOne({email : email_user_to_remove});
        if (!userToRemove) {
          return res.status(404).json({ message: 'User To remove not found' });
        }
        const ind = group.users.indexOf(userToRemove._id) ;
        if(ind===-1){
            return res.status(404).json({ message: 'User To remove is not a Member of this group' });
        }
        group.users.splice(ind,1);
        await group.save();
        // await Group.findByIdAndUpdate(group._id, { $pull: { users: userToRemove._id } });
        res.json({ message: 'User removed from the group successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error removing user from group' });
        console.error(error);
      }
  }
  
const fetchGroupDetails = async(req,res) => {
    try{
        const _id = req.params.groupId;
        const group =await Group.findOne({_id}).populate( 
          {path:'users',select:'_id user_name name'} 
        ).populate( 
          {path:'bills',select:'_id payer_id payer amount'}
        );
        return res.json(group);
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }
}
const fetchMyGroups = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({path : 'joined_groups'}); 
    let groups=user.joined_groups;
    res.json({ groups });
  } catch (error) {
    res.status(500).json({ message: 'Error in fetching groups' });
    console.error(error);
  }
};

module.exports = { 
    createGroup,
    addMember ,
    joinGroup, 
    fetchGroupsName,
    removeGroup,
    removeMemberFromGroup,
    fetchGroupDetails,
    fetchMyGroups
}
 