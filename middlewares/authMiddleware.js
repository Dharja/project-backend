function checkUserRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next(); 
        } else {
            res.status(403).json({ error: 'Acceso no autorizado' }); 
        }
    };
}

// Middleware para verificar si un usuario es administrador
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ error: 'Acceso solo para administradores' });
    }
}

module.exports = { checkUserRole, isAdmin };