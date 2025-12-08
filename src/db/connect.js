import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  const connectionInstance = mongoose.connect(
    `${process.env.MONGODB_URL}/${DB_NAME}`
  );

  return connectionInstance;
};
export default connectDB;
