// Load env variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  
  // Import dependencies
  const express = require("express");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const connectToDB = require("./config/connetctToDB");
  const billsControllers = require("./controllers/billsControllers");
  const usersControllers = require("./controllers/usersControllers");
  const requireAuth = require("./middleware/requireAuth");
  
  // Create an express app
  const app = express();
  
  // Configure express app
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  
  // Connect to database
  connectToDB();
  
  // Routing
  app.post("/signup", usersControllers.signup);
  app.post("/login", usersControllers.login);
  app.get("/logout", usersControllers.logout);
  app.get("/check-auth", requireAuth, usersControllers.checkAuth);
  app.get("/bills", requireAuth,billsControllers.fetchBills);
  app.get("/bill/:id",requireAuth, billsControllers.fetchBill);
  app.post("/addBill", requireAuth,billsControllers.createBill);
  app.put("/updateBill/:id", requireAuth,billsControllers.updateBill);
  app.delete("/deleteBill/:id", requireAuth,billsControllers.deleteBill);
  app.delete("/deleteBills/",requireAuth, billsControllers.deleteBills);
  
  // Start our server
  app.listen(process.env.PORT);