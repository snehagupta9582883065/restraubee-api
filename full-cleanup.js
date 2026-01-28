require('dotenv').config();
const db = require("./src/models");

async function fullCleanup() {
    try {
        console.log("Starting FULL TRUNCATION of branch and inventory data...");

        // Disable foreign key checks
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        const tables = [
            'order_items',
            'orders',
            'inventory_items',
            'inventory_categories',
            'branches'
        ];

        for (const table of tables) {
            await db.sequelize.query(`TRUNCATE TABLE ${table}`);
            console.log(`Truncated table: ${table}`);
        }

        // Reset user branch links
        await db.user.update({ mainBranchId: null }, { where: {} });
        console.log("Reset all user mainBranchId links to NULL.");

        // Re-enable foreign key checks
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log("FULL cleanup completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error during cleanup:", err.message);
        // Try to re-enable foreign keys even on error
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => { });
        process.exit(1);
    }
}

fullCleanup();
