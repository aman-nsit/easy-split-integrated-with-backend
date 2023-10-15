const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function requireAuth(req, res, next) {
  try {
    // Read token off cookies

    const jwtRegex = /Authorization=([^;]*)/;
    const matches = req.headers.cookie.match(jwtRegex);
    if (matches && matches[1]) {
      const token = matches[1];
      console.log(token);
          // Decode the token
      const decoded = jwt.verify(token, process.env.SECRET);

      // Check expiration
      if (Date.now() > decoded.exp) return res.sendStatus(401);

      // Find user using decoded sub
      const user = await User.findById(decoded.sub);
      if (!user) return res.sendStatus(401);

      // attach user to req
      req.user = user;

      // continue on
      next();
    } else {
      console.log("JWT not found in the input string.");
    }

  
  } catch (err) {
    return res.sendStatus(401);
  }
}

module.exports = requireAuth; 