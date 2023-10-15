const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function requireAuth(req, res, next) {
  try {
    // Read token off cookies
    // console.log(req);
    // console.log(req);  
    // console.log(req.header);
    // console.log(req.cookies);

    const token = req.headers.token;

    // console.log(token);
    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Check expiration
    if (Date.now() > decoded.exp) return res.sendStatus(401);

    // Find user using decoded sub
    const user = await User.findById(decoded.sub);
    if (!user) return res.sendStatus(401);
    //console.log(user);
    // attach user to req
    req.user = user;

    // continue on
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

module.exports = requireAuth; 