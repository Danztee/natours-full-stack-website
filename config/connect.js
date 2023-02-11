const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    mongoose.set("strictQuery", true);
    const connect = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("mongoDB error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
