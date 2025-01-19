//db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  mongoose.set('debug', true);

    console.log(`MongoDB connected: ${conn.connection.host} : ${conn.connection.port}`);
  } catch (error) {
    console.log(error);
    
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
