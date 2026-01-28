const { authJwt, validateBranchOwnership } = require("../middleware");
const controller = require("../controllers/order.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/orders",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.createOrder
    );

    app.post(
        "/api/orders/bulk",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.bulkCreateOrders
    );

    app.get(
        "/api/orders",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.getOrders
    );
};
