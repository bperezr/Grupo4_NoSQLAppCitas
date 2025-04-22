function getRedirectURL(rol) {
    switch (rol) {
        case 'admin': return '/admin';
        case 'doctor': return '/doctor';
        case 'farmaceutico': return '/farmaceutico';
        default: return '/login';
    }
}

exports.verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const usuario = req.session.usuario;

        if (!usuario) {
            return res.redirect('/login');
        }

        const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

        if (!roles.includes(usuario.rol)) {
            return res.status(403).render('denegado', {
                usuario,
                getRedirectURL
            });
        }

        next();
    };
};