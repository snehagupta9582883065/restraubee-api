require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('=== MySQL Connection Diagnostics ===\n');
    console.log('Environment Variables:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET');
    console.log('\n=== Testing Connection ===\n');

    const configs = [
        {
            name: 'With SSL (rejectUnauthorized: false)',
            config: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                connectTimeout: 60000,
                ssl: {
                    rejectUnauthorized: false
                }
            }
        },
        {
            name: 'Without SSL',
            config: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                connectTimeout: 60000
            }
        },
        {
            name: 'With SSL (require)',
            config: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                connectTimeout: 60000,
                ssl: 'Amazon RDS'
            }
        }
    ];

    for (const { name, config } of configs) {
        console.log(`\nTrying: ${name}`);
        try {
            const connection = await mysql.createConnection(config);
            console.log('✅ SUCCESS! Connection established.');
            await connection.end();
            console.log('Connection closed gracefully.');
            return;
        } catch (error) {
            console.log('❌ FAILED');
            console.log('Error code:', error.code);
            console.log('Error message:', error.message);
        }
    }

    console.log('\n=== All connection attempts failed ===');
    console.log('\nPossible issues:');
    console.log('1. Railway MySQL service might not be running');
    console.log('2. Connection details (host/port) might be incorrect');
    console.log('3. Firewall or network restrictions');
    console.log('4. Railway service variables might have changed');
    console.log('\nPlease verify your Railway MySQL service is active and get the latest connection details from Railway dashboard.');
}

testConnection().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
