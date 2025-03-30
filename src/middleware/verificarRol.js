function getRedirectURL(rol) {
    switch (rol) {
        case 'admin': return '/admin';
        case 'doctor': return '/doctor';
        case 'paciente': return '/paciente';
        default: return '/login';
    }
}

exports.verificarRol = (rolRequerido) => {
    return (req, res, next) => {
        const usuario = req.session.usuario;

        if (!usuario) {
            return res.redirect('/login');
        }

        if (usuario.rol !== rolRequerido) {
            return res.status(403).render('denegado', {
                usuario,
                getRedirectURL
            });
        }

        next();
    };
};
