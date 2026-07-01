const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getPersonalizedRecommendations
} = require("../controllers/personalizedRecommendationController");

router.get(
    "/",
    protect,
    getPersonalizedRecommendations
);

module.exports = router;