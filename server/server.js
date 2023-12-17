// Load env variables
require("dotenv").config();
  
  // Import dependencies
  const express = require("express");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const connectToDB = require("./config/connectToDB");
  const userRoutes = require('./routes/userRoutes');
  const groupRoutes = require('./routes/groupRoutes');
  const billRoutes = require('./routes/billRoutes');
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
  app.use('/users', userRoutes); 
  app.use('/groups', groupRoutes); 
  app.use('/bills', billRoutes);
  
  // Start our server`
  app.listen(process.env.PORT);