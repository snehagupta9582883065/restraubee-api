module.exports = {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 3306,
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    DB: process.env.DB_NAME || "testdb",
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        },
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
};
