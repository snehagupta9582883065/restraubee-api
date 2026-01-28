require('dotenv').config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const db = require("./src/models");
const app = express();

var corsOptions = {
    origin: ["http://localhost:8081", "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:8081", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]
};

app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Hello World." });
});

// database initialization
const Role = db.role;

// In production, use db.sequelize.sync();
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Syncing Db and Altering Tables...');
    initial();
});

function initial() {
    Role.findOrCreate({
        where: { id: 1 },
        defaults: { name: "user" }
    });

    Role.findOrCreate({
        where: { id: 2 },
        defaults: { name: "admin" }
    });

    Role.findOrCreate({
        where: { id: 3 },
        defaults: { name: "super-admin" }
    });
}

// routes
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/order.routes')(app);
require('./src/routes/inventory.routes')(app);
require('./src/routes/admin.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
