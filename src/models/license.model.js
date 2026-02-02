module.exports = (sequelize, Sequelize) => {
    const License = sequelize.define("license", {
        machineId: {
            type: Sequelize.STRING
        },
        licenseKey: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "ACTIVE"
        },
        lastLogin: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        previousMachineIds: {
            type: Sequelize.TEXT // Stored as JSON string
        }
    });

    return License;
};
