const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MongoDB connection with options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options help with connection stability
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("💥 Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("👋 MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
