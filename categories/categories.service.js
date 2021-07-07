const db = require('../utils/db');
const Category = db.Category;
const { ObjectId } = require('bson');


const getAllCategories = async () => {
    return await Category.find({});
}

const getCategoryById = async (id) => {
    const category = await Category.findOne({ _id: ObjectId(id) });
    if (!category) {
        throw 'Category not found';
    }
    return await Category.findOne({ _id: ObjectId(id) });
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
    const currentCategory = await Category.findOne({ _id: ObjectId(id) });
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
    const currentCategory = await Category.findOne({ _id: ObjectId(id) });
    if (
        !(currentCategory)
    ) {
        throw 'Category not found';
    }
    const response = await Category.deleteOne({ _id: ObjectId(id) });
    return response;

}

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
}