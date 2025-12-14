import mongoose from "mongoose";
import { add_init } from "./init_data/init_db.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/restaurantDB";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    // console.log(" MongoDB connected successfully: ", MONGO_URI);
    // console.log("Connected DB name:", mongoose.connection.name);
    // console.log("Connected host:", mongoose.connection.host);
    // console.log("Connected port:", mongoose.connection.port);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections found:", collections.map(c => c.name));

    // await add_init();
  } catch (err) {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
