const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        port: config.PORT,
        dialect: config.dialect,
        dialectOptions: config.dialectOptions,
        operatorsAliases: false,
        logging: false, // Disable SQL logging
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.branch = require("../models/branch.model.js")(sequelize, Sequelize);
db.license = require("../models/license.model.js")(sequelize, Sequelize);

// Associations
db.user.hasMany(db.license, { foreignKey: "userId", as: "licenses" });
db.license.belongsTo(db.user, { foreignKey: "userId", as: "user" });

db.user.hasMany(db.branch, { foreignKey: "parentAdminId", as: "branches" });
db.branch.belongsTo(db.user, { foreignKey: "parentAdminId", as: "admin" });

// Manager/Staff associations
db.branch.hasMany(db.user, { foreignKey: "mainBranchId", as: "staff" });
db.user.belongsTo(db.branch, { foreignKey: "mainBranchId", as: "mainBranch" });
db.order = require("../models/order.model.js")(sequelize, Sequelize);
db.orderItem = require("../models/orderItem.model.js")(sequelize, Sequelize);

db.order.hasMany(db.orderItem, { as: "totalItems" });
db.orderItem.belongsTo(db.order, {
    foreignKey: "orderId",
    as: "order",
});

db.inventoryCategory = require("../models/inventoryCategory.model.js")(sequelize, Sequelize);
db.inventoryItem = require("../models/inventoryItem.model.js")(sequelize, Sequelize);

db.inventoryCategory.hasMany(db.inventoryItem, { as: "items", foreignKey: "categoryId" });
db.inventoryItem.belongsTo(db.inventoryCategory, {
    foreignKey: "categoryId",
    as: "category",
});

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.ROLES = ["user", "admin", "super-admin"];

module.exports = db;
