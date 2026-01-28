module.exports = (sequelize, Sequelize) => {
    const Branch = sequelize.define("branches", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        parentAdminId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDefault: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        licenseKey: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM('Active', 'Maintenance', 'Closed'),
            defaultValue: 'Active'
        },
        activeStaff: {
            type: Sequelize.INTEGER
        },
        workingHours: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.TEXT('long')
        }
    });

    return Branch;
};
