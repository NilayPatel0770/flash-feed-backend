const mongoose = require("mongoose");

// Function to connect MongoDB database
const connectDB = async () => {
  try {
    // Function to connect MongoDB database
    await mongoose.connect(
     process.env.MONGO_URI
    );
    console.log("MongoDB Connected ");
  } catch (err) {
    console.error("DB Connection Error ", err);
    process.exit(1);
  }
};

module.exports = connectDB;