require('dotenv').config();
const db = require("./src/models");
const Branch = db.branch;

async function checkBranches() {
    try {
        const count = await Branch.count();
        const branches = await Branch.findAll({ attributes: ['id', 'name', 'isDefault'] });
        console.log(`Total branches in DB: ${count}`);
        console.log("Branches list:", JSON.stringify(branches, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

checkBranches();
