const express = require("express");

const router = express.Router();

const {
    addArticle,
    getArticles,
    getArticle,
    editArticle,
    removeArticle
} = require("../controllers/newsController");

router.post("/", addArticle);
router.get("/", getArticles);
router.get("/:id", getArticle);
router.put("/:id", editArticle);
router.delete("/:id", removeArticle);

module.exports = router;