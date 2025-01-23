import mongoose from "mongoose";
import dontenv from "dotenv";

dontenv.config();


export const connectDB = async () => {

 try {
    const  MONGODB_URI  = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("Please set the MONGODB_URI environment variable");
    }
  
    await mongoose.connect(MONGODB_URI, { });
    console.log("Connected to MongoDB");
 } catch (error) {
    console.log("Failed to connect to MongoDB", error);
    
 }
};