const express = require("express");

const router = express.Router();

const {
    addCategory,
    getAllCategories,
    getCategory,
    editCategory,
    removeCategory,
} = require("../controllers/categoryController");

router.post("/", addCategory);

router.get("/", getAllCategories);

router.get("/:id", getCategory);

router.put("/:id", editCategory);

router.delete("/:id", removeCategory);

module.exports = router;