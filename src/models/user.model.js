module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        companyName: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.ENUM('super-admin', 'admin', 'user'),
            defaultValue: 'user'
        },
        mainBranchId: {
            type: Sequelize.INTEGER
        }
    });

    return User;
};
