const authorize = (role) => {
    return (req, res, next) => {
        const requiredRole = "ROLE_" + role.toUpperCase();
        if (!req.user || !req.user.roles || !req.user.roles.includes(requiredRole)) {
            return res.status(403).send({
                message: `Require ${role} Role!`
            });
        }
        next();
    };
};

module.exports = authorize;
