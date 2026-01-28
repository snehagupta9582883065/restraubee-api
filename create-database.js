require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
    console.log('=== Creating Database on Railway MySQL ===\n');

    try {
        // Connect without specifying a database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log('✅ Connected to MySQL server');

        // Create the database
        const dbName = process.env.DB_NAME || 'testdb';
        console.log(`\nCreating database: ${dbName}`);

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' created successfully!`);

        // Verify it exists
        const [databases] = await connection.query('SHOW DATABASES');
        console.log('\nAvailable databases:');
        databases.forEach(db => {
            const name = db.Database || db.SCHEMA_NAME;
            console.log(`  - ${name}`);
        });

        await connection.end();
        console.log('\n✅ Setup complete! You can now start your server.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Code:', error.code);
        process.exit(1);
    }
}

createDatabase();
