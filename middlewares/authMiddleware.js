function checkUserRole(role) {
    return (req, res, next) => {
        if (req.user?.role !== role) {
            res.status(403).json({ message: 'Acceso no autorizado' });
            return;
        }

    next();
    };
}


function isAuth(req, res, next){
    return (req, res, next) => {
        if (!req.user) {
            res.redirect('/login');
            return;
        }
        next();
    }
}

function isNotAuth(req, res, next) {
    return (req, res, next) => {
        if (req.user) {
            res.redirect('/');
            return;
        }
        next();
    }
}   

// Middleware para verificar si un usuario es administrador
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ error: 'Acceso solo para administradores' });
    }
}

module.exports = { checkUserRole, isAdmin, isAuth, isNotAuth };