module.exports = (sequelize, Sequelize) => {
    const InventoryCategory = sequelize.define("inventory_categories", {
        branchId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        categoryName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return InventoryCategory;
};
