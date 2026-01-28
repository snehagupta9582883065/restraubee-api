const db = require("../models");
const Branch = db.branch;

const validateBranchOwnership = async (req, res, next) => {
    try {
        const branchId = req.params.branchId || req.headers["x-branch-id"] || req.user.mainBranchId;

        if (!branchId) {
            return res.status(400).send({ message: "Branch ID is required!" });
        }

        const branch = await Branch.findByPk(branchId);

        if (!branch) {
            return res.status(404).send({ message: "Branch not found!" });
        }

        if (branch.parentAdminId !== req.userId && branch.id !== req.user.mainBranchId) {
            return res.status(403).send({ message: "Unauthorized access to this branch!" });
        }

        req.branchId = branchId;
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = validateBranchOwnership;
