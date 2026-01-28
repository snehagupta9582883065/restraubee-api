module.exports = (sequelize, Sequelize) => {
    const InventoryItem = sequelize.define("inventory_items", {
        itemName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        }
    });

    return InventoryItem;
};
