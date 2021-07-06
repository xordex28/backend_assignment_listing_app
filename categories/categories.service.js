const config = require('config.json');
const db = require('../utils/db');
const Category = db.Category;
const bson = require('bson');

const getAllCategories = async () => {
    return await Category.find({});
}

const getCategoryById = async (id) => {
    const category = await Category.findOne({ _id: bson.ObjectId(id) });
    if (!category) {
        throw 'Category not found';
    }
    return await Category.findOne({ _id: bson.ObjectId(id) });
}

const addCategory = async (category) => {
    if (!('description' in category)) {
        throw 'Field Category not defined';
    }
    const categoryName = category.description.trim().toLowerCase();
    if (
        await Category.findOne({ description: categoryName })
    ) {
        throw 'Category ' + categoryName + ' is already exist';
    }

    if (category?.description) {
        category.description = category.description.trim().toLowerCase();
    }

    const newCategory = new Category(category);

    await newCategory.save((err) => {
        if (err) {
            throw err;
        }
    });

    return newCategory;
}

const updateCategory = async (id, category) => {
    const currentCategory = await Category.findOne({ _id: bson.ObjectId(id) });
    if (
        !(currentCategory)
    ) {
        throw 'Category not found';
    }
    if (category.description) {
        category.description = category.description.trim().toLowerCase();
    }

    category.updatedDate = Date.now();

    Object.assign(currentCategory, category);

    await currentCategory.save((err) => {
        if (err) {
            throw err;
        }
    });
    return currentCategory;
}

const deleteCategory = async (id) => {
    const currentCategory = await Category.findOne({ _id: bson.ObjectId(id) });
    if (
        !(currentCategory)
    ) {
        throw 'Category not found';
    }
    try {
        const response = await Category.deleteOne({ _id: bson.ObjectId(id) });
        return response;
    } catch (err) {
        throw err;
    }

}

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
}