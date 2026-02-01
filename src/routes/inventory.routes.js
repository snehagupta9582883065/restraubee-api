const { authJwt, validateBranchOwnership } = require("../middleware");
const controller = require("../controllers/inventory.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post(
        "/api/inventory",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.createInventory
    );

    app.post(
        "/api/inventory/category",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.addCategory
    );

    app.post(
        "/api/inventory/item",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.addItem
    );

    app.put(
        "/api/inventory/category/:id",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.updateCategory
    );

    app.delete(
        "/api/inventory/category/:id",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.deleteCategory
    );

    app.put(
        "/api/inventory/item/:id",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.updateItem
    );

    app.delete(
        "/api/inventory/item/:id",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.deleteItem
    );


    app.get(
        "/api/inventory",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.getInventoryByBranch
    );

    app.get(
        "/api/inventory/:branchId",
        [authJwt.verifyToken, validateBranchOwnership],
        controller.getInventoryByBranch
    );
};
