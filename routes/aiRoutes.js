const express = require("express");

const router = express.Router();

const { summarizeArticle, generateKeywords, getSentiment } = require("../controllers/aiController");

router.post("/summary", summarizeArticle);
router.post("/keywords", generateKeywords);
router.post("/sentiment", getSentiment);

module.exports = router;
