const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function signup(req, res) {
  try {
    // Get the email and password off req body
    const { name , user_name , email, password } = req.body;
    const temp_user = await User.findOne({user_name});
    if(temp_user){
      return res.json("User_name Already Exist")
    }
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create a user with the daTa
    await User.create({ name, user_name , email, password: hashedPassword });

    // respond
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function login(req, res) {
  try {
    // Get the email and password off rq body
    const { email, password } = req.body;
    // Find the user with requested email
    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(401);

    // Compare sent in password with found user password hash
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

    // create a jwt token
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET);

    // Set the cookie

    // res.cookie("Authorization", token, {
    //   expires: new Date(exp),
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    // });

    // send it
    // res.sendStatus(200);
    res.status(200).json({
      accesstoken: token,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

function logout(req, res) {
  try {
    res.cookie("Authorization", "", { expires: new Date() });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}
const fetchUserDetails = async (req,res) => {
  try{
    const userDetails = await User.findOne({email:req.user.email});
    res.json({
      _id:userDetails._id,
      name:userDetails.name,
      user_name:userDetails.user_name ,
      joined_groups:userDetails.joined_groups,
      user_bills : userDetails.bills 

    });
  }
  
  catch(err){
    console.log(err);
    res.sendStatus(200);
  }
} ;

function checkAuth(req, res) {
  try {
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }

}

const getAllUsers = async (req,res) => {
  try{
    const userDetails = await User.find({},'_id user_name');
    res.json(
      userDetails

    );
  }
  catch(err){
    console.log(err);
    res.sendStatus(400);
  }
}

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  fetchUserDetails,
  getAllUsers
};