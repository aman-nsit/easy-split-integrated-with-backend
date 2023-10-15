const mongoose = require("mongoose");

async function connectToDB() {
  try {
    const dbName = "split-app";
    await mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to database: ${dbName}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectToDB;