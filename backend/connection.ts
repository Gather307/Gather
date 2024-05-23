import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url: string = process.env.VITE_MONGO_URI as string;
let connection: typeof mongoose;

/**
 * Makes a connection to a MongoDB database. If a connection already exists, does nothing
 * Call this function before all api routes
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  console.log("Checking database connection...");
  if (!connection) {
    console.log("Connecting to database...");
    console.log(url);
    try {
      connection = await mongoose.connect(url);
      return connection;
    } catch (error) {
      console.log(error);
    }
  }
};

export default connectDB;
