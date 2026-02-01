const db = require("../models");
const Category = db.inventoryCategory;
const Item = db.inventoryItem;

exports.createInventory = async (req, res) => {
    try {
        const branchId = req.branchId;
        const { categories } = req.body;

        if (!categories || !Array.isArray(categories)) {
            return res.status(400).send({ message: "categories array is required!" });
        }

        for (const catData of categories) {
            const category = await Category.create({
                branchId: branchId,
                categoryName: catData.categoryName
            });

            if (catData.items && Array.isArray(catData.items)) {
                const items = catData.items.map(item => ({
                    itemName: item.itemName,
                    price: item.price,
                    categoryId: category.id
                }));
                await Item.bulkCreate(items);
            }
        }

        const result = await Category.findAll({
            where: { branchId: branchId },
            include: [{
                model: Item,
                as: "items",
                attributes: { exclude: ["createdAt", "updatedAt", "categoryId"] }
            }],
            attributes: { exclude: ["createdAt", "updatedAt"] }
        });

        res.status(201).send({
            branchId: branchId,
            categories: result
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.addCategory = async (req, res) => {
    try {
        const branchId = req.branchId;
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).send({ message: "categoryName is required!" });
        }

        const category = await Category.create({
            branchId: branchId,
            categoryName: categoryName
        });

        res.status(201).send({
            message: "Category added successfully!",
            category: category
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.addItem = async (req, res) => {
    try {
        const branchId = req.branchId;
        const { categoryId, itemName, price } = req.body;

        if (!categoryId || !itemName || !price) {
            return res.status(400).send({ message: "categoryId, itemName, and price are required!" });
        }

        // Verify category belongs to branch
        const category = await Category.findOne({
            where: { id: categoryId, branchId: branchId }
        });

        if (!category) {
            return res.status(404).send({ message: "Category not found or does not belong to this branch!" });
        }

        const item = await Item.create({
            categoryId: categoryId,
            itemName: itemName,
            price: price
        });

        res.status(201).send({
            message: "Item added successfully!",
            item: item
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getInventoryByBranch = async (req, res) => {
    try {
        const branchId = req.branchId;
        const categories = await Category.findAll({
            where: { branchId: branchId },
            include: [{
                model: Item,
                as: "items",
                attributes: { exclude: ["createdAt", "updatedAt", "categoryId"] }
            }],
            attributes: { exclude: ["createdAt", "updatedAt"] }
        });

        res.status(200).send({
            branchId: branchId,
            categories: categories
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const branchId = req.branchId;
        const { id } = req.params;
        const { categoryName } = req.body;

        const category = await Category.findOne({
            where: { id: id, branchId: branchId }
        });

        if (!category) {
            return res.status(404).send({ message: "Category not found or does not belong to this branch!" });
        }

        category.categoryName = categoryName || category.categoryName;
        await category.save();

        res.status(200).send({
            message: "Category updated successfully!",
            category: category
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const branchId = req.branchId;
        const { id } = req.params;

        const category = await Category.findOne({
            where: { id: id, branchId: branchId }
        });

        if (!category) {
            return res.status(404).send({ message: "Category not found or does not belong to this branch!" });
        }

        // Delete all items in this category first (if cascade is not set in DB)
        await Item.destroy({ where: { categoryId: id } });
        await category.destroy();

        res.status(200).send({
            message: "Category and its items deleted successfully!"
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const branchId = req.branchId;
        const { id } = req.params;
        const { itemName, price, categoryId } = req.body;

        // Verify the item exists and belongs to a category in this branch
        const item = await Item.findOne({
            where: { id: id },
            include: [{
                model: Category,
                as: "category",
                where: { branchId: branchId }
            }]
        });

        if (!item) {
            return res.status(404).send({ message: "Item not found or does not belong to this branch!" });
        }

        // If categoryId is provided to be updated, verify it belongs to the branch
        if (categoryId) {
            const category = await Category.findOne({
                where: { id: categoryId, branchId: branchId }
            });
            if (!category) {
                return res.status(400).send({ message: "Target category not found or does not belong to this branch!" });
            }
            item.categoryId = categoryId;
        }

        item.itemName = itemName || item.itemName;
        item.price = price !== undefined ? price : item.price;
        await item.save();

        res.status(200).send({
            message: "Item updated successfully!",
            item: item
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const branchId = req.branchId;
        const { id } = req.params;

        // Verify the item exists and belongs to a category in this branch
        const item = await Item.findOne({
            where: { id: id },
            include: [{
                model: Category,
                as: "category",
                where: { branchId: branchId }
            }]
        });

        if (!item) {
            return res.status(404).send({ message: "Item not found or does not belong to this branch!" });
        }

        await item.destroy();

        res.status(200).send({
            message: "Item deleted successfully!"
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
