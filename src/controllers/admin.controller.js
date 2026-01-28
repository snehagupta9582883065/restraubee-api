const db = require("../models");
const Branch = db.branch;
const User = db.user;
const Category = db.inventoryCategory;
const Item = db.inventoryItem;
const bcrypt = require("bcryptjs");

const authConfig = require("../config/auth.config");

exports.createBranch = async (req, res) => {
    try {
        const {
            name,
            userEmail,
            userPassword,
            description,
            location,
            phone,
            status,
            activeStaff,
            workingHours,
            image,
            copyInventoryFrom
        } = req.body;

        if (!name || !userEmail || !userPassword) {
            return res.status(400).send({ message: "Branch name, user email, and user password are required!" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: userEmail } });
        if (existingUser) {
            return res.status(400).send({ message: "User email is already in use!" });
        }

        // Generate encrypted license key (secret + email)
        const generatedLicenseKey = bcrypt.hashSync(authConfig.secret + userEmail, 8);

        // 1. Create Branch User
        const newUser = await User.create({
            email: userEmail,
            username: userEmail,
            password: bcrypt.hashSync(userPassword, 8),
            role: "user"
        });
        await newUser.setRoles([1]); // Default 'user' role

        // 2. Create Branch
        const branch = await Branch.create({
            name: name,
            parentAdminId: req.userId,
            isDefault: false,
            licenseKey: generatedLicenseKey,
            description: description,
            address: location,
            phone: phone,
            status: status || "Active",
            activeStaff: activeStaff,
            workingHours: workingHours,
            image: image
        });

        // 3. Link Branch to User
        await newUser.update({ mainBranchId: branch.id });

        // 🔟 INVENTORY COPY LOGIC
        if (copyInventoryFrom) {
            const sourceBranch = await Branch.findOne({
                where: { id: copyInventoryFrom, parentAdminId: req.user.id }
            });

            if (sourceBranch) {
                const categories = await Category.findAll({
                    where: { branchId: copyInventoryFrom },
                    include: ["items"]
                });

                for (const cat of categories) {
                    const newCat = await Category.create({
                        branchId: branch.id,
                        categoryName: cat.categoryName
                    });

                    if (cat.items && cat.items.length > 0) {
                        const newItems = cat.items.map(item => ({
                            itemName: item.itemName,
                            price: item.price,
                            categoryId: newCat.id
                        }));
                        await Item.bulkCreate(newItems);
                    }
                }
            }
        }

        res.status(201).send({
            message: "Branch created successfully!",
            branch: {
                ...branch.toJSON(),
                managerEmail: userEmail
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getAdminBranches = async (req, res) => {
    try {
        const branches = await Branch.findAll({
            where: {
                parentAdminId: req.user.id,
                isDefault: false
            },
            include: [{
                model: User,
                as: 'staff',
                attributes: ['email']
            }]
        });

        const formattedBranches = branches.map(branch => {
            const branchData = branch.toJSON();
            // Include manager email inside the branch object
            branchData.managerEmail = branchData.staff && branchData.staff.length > 0 ? branchData.staff[0].email : null;
            delete branchData.staff;
            return branchData;
        });

        res.status(200).send(formattedBranches);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findOne({
            where: {
                id: req.params.id,
                parentAdminId: req.user.id
            },
            include: [{
                model: User,
                as: 'staff',
                attributes: ['email']
            }]
        });

        if (!branch) {
            return res.status(404).send({ message: "Branch not found or you don't have access." });
        }

        const branchData = branch.toJSON();
        // Include manager email inside the branch object
        branchData.managerEmail = branchData.staff && branchData.staff.length > 0 ? branchData.staff[0].email : null;
        delete branchData.staff;

        res.status(200).send(branchData);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
