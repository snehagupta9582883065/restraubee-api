const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.userSignup = (req, res) => {
    signupWithRole(req, res, 'user');
};

exports.adminSignup = (req, res) => {
    signupWithRole(req, res, 'admin');
};

const signupWithRole = (req, res, roleName) => {
    // Save User to Database
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username || req.body.email,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
        status: req.body.status,
        companyName: req.body.companyName,
        address: req.body.address,
        role: roleName
    })
        .then(async user => {
            // Generate encrypted license key (secret + email)
            const generatedLicenseKey = bcrypt.hashSync(config.secret + user.email, 8);

            // Create default branch for EVERY user
            const branch = await db.branch.create({
                name: `Default ${user.firstName || user.username} Branch`,
                parentAdminId: user.id,
                isDefault: true,
                licenseKey: generatedLicenseKey
            });
            await user.update({ mainBranchId: branch.id });

            // Map role name to ID (user: 1, admin: 2, super-admin: 3)
            const roleId = roleName === 'admin' ? 2 : (roleName === 'super-admin' ? 3 : 1);

            user.setRoles([roleId]).then(() => {
                res.send({ message: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} registered successfully!` });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }

                var token = jwt.sign({
                    id: user.id,
                    roles: authorities,
                    mainBranchId: user.mainBranchId
                }, config.secret, {
                    expiresIn: config.jwtExpiration // 155 min
                });

                var refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
                    expiresIn: config.jwtRefreshExpiration // 3 hours
                });

                db.branch.findByPk(user.mainBranchId).then(branch => {
                    res.status(200).send({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        status: user.status,
                        companyName: user.companyName,
                        address: user.address,
                        roles: authorities,
                        mainBranchId: user.mainBranchId,
                        licenseKey: branch ? branch.licenseKey : null,
                        accessToken: token,
                        refreshToken: refreshToken
                    });
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
