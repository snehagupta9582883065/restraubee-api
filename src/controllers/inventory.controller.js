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
