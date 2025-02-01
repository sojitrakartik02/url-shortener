import mongoose from "mongoose";
import "dotenv/config";
const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" mongo Connected");
  } catch (error) {
    console.error(" MongoDB connection is  fail:", error.message);
    process.exit(1);
  }
};

export default connectDB;
