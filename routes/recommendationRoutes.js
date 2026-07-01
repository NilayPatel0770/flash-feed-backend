const express = require("express");

const router = express.Router();

const {
    getRecommendations
} = require("../controllers/recommendationController");

router.get("/article/:articleId", getRecommendations);

module.exports = router;