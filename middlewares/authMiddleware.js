function checkUserRole(role) {
    return (req, res, next) => {
    
    if (req.user && req.user.role === role) {
        next();
    } else {
        res.status(403).json({ error: 'Acceso no autorizado' });
    }
    };
}

module.exports = { checkUserRole };