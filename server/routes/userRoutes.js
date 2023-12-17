const express = require('express');
const router = express.Router();

const usersControllers = require("../controllers/usersControllers");

const requireAuth = require("../middleware/requireAuth");

router.post("/signup", usersControllers.signup);
router.post("/login", usersControllers.login);
router.get("/logout", usersControllers.logout);
router.get("/check-auth", requireAuth, usersControllers.checkAuth);
router.get("/userDetails",requireAuth, usersControllers.fetchUserDetails);
router.get("/allUsers",requireAuth, usersControllers.getAllUsers);

module.exports = router;