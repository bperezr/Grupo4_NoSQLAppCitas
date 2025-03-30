exports.verificarRol = (rolRequerido) => {
    return (req, res, next) => {
        const usuario = req.session.usuario;

        if (!usuario) {
            return res.redirect('/login');
        }

        if (usuario.rol !== rolRequerido) {
            return res.status(403).send('Acceso denegado');
        }

        next();
    };
};