module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        branchId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        },
        tableNumber: {
            type: Sequelize.STRING
        },
        customerName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        customerPhone: {
            type: Sequelize.STRING
        },
        customerEmail: {
            type: Sequelize.STRING
        },
        notes: {
            type: Sequelize.TEXT
        },
        totalAmount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        tableStatus: {
            type: Sequelize.STRING,
            defaultValue: "AVAILABLE"
        },
        orderType: {
            type: Sequelize.STRING,
            defaultValue: "DINE_IN"
        },
        orderStatus: {
            type: Sequelize.STRING,
            defaultValue: "WAITING"
        },
        invoiceId: {
            type: Sequelize.STRING
        },
        paymentMethod: {
            type: Sequelize.STRING
        },
        discount: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0
        },
        serviceCharge: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0
        },
        gstRate: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0
        },
        appliedCharges: {
            type: Sequelize.TEXT // Stored as JSON string
        },
        date: {
            type: Sequelize.DATE
        }
    });

    return Order;
};
