require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const likeRoutes = require("./routes/likeRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const historyRoutes = require("./routes/historyRoutes");
const personalizedRecommendationRoutes = require("./routes/personalizedRecommendationRoutes");
const path = require("path");
const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/recommendations/personalized", personalizedRecommendationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/ai", aiRoutes);

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
    message: "Route not found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
