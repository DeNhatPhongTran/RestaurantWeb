// scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { add_init } from "../database/init_data/init_db.js";

dotenv.config();

// Kết nối local MongoDB với authentication
const MONGODB_URI = process.env.MONGODB_LOCAL_URI || "mongodb://restaurant_db:1zMaouI2T8WPEc0T@localhost:27017/restaurant_management?authSource=admin";

async function main() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log(`📍 Using: ${MONGODB_URI.split('@')[1] || MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");

    console.log("\n📊 Seeding database with initial data...");
    await add_init();

    console.log("\n✅ Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
    process.exit(1);
  }
}

main();
