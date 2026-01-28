const { authJwt, authorize, validateBranchOwnership } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, x-branch-id, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/admin/branches",
        [authJwt.verifyToken, authorize("admin")],
        controller.createBranch
    );

    app.get(
        "/api/admin/branches/:id",
        [authJwt.verifyToken, authorize("admin")],
        controller.getBranchById
    );

    app.get(
        "/api/admin/branches",
        [authJwt.verifyToken, authorize("admin")],
        controller.getAdminBranches
    );

    app.get(
        "/api/admin/test",
        [authJwt.verifyToken, authorize("admin")],
        (req, res) => {
            res.status(200).send({ message: "Welcome Admin! This is a dedicated admin route." });
        }
    );
};
