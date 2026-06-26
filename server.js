require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes=require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth",authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoryRoutes);

// Routes

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running Successfully",
  });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
