const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses JSON request bodies

// Import routes
const contactRoutes = require("./routes/contacts");

// Basic route to test server
app.get("/", (req, res) => {
  res.json({
    message: "Contact Book API is running!",
    version: "1.0.0",
    endpoints: {
      contacts: "/api/contacts",
      docs: "Check README for API documentation",
    },
  });
});

// Use routes
app.use("/api/contacts", contactRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit if database connection fails
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // Connect to database first
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Visit: http://localhost:${PORT}`);
  });
};

startServer();
