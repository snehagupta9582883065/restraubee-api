require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: console.log,
        dialectOptions: {
            connectTimeout: 60000,
            ssl: {
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 10000
        }
    }
);

console.log('Attempting to connect to MySQL database...');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);

sequelize.authenticate()
    .then(() => {
        console.log('\n✅ Connection has been established successfully!');
        return sequelize.close();
    })
    .then(() => {
        console.log('Connection closed.');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ Unable to connect to the database:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
        console.error('\nFull error:', err);
        process.exit(1);
    });
