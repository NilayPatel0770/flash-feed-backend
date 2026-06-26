const Category = require("../models/Category");

const createCategory = async (data) => {
    return await Category.create(data);
};

const getCategories = async () => {
    return await Category.find({ isActive: true }).sort({ name: 1 });
};

const getCategoryById = async (id) => {
    return await Category.findById(id);
};

const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
};

const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};