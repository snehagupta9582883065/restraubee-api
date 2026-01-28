module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define("order_items", {
        itemname: {
            type: Sequelize.STRING
        },
        priceperunit: {
            type: Sequelize.DECIMAL(10, 2)
        },
        quantity: {
            type: Sequelize.INTEGER
        }
    });

    return OrderItem;
};
