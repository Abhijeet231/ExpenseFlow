import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      serverSelectionTimeoutMS: 5000, // fail fast instead of hanging
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
