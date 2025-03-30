const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.redirect('/login?error=usuario');
        }

        const match = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!match) {
            return res.redirect('/login?error=clave');
        }

        req.session.usuario = {
            id: usuario._id,
            email: usuario.email,
            rol: usuario.rol
        };

        switch (usuario.rol) {
            case 'admin':
                return res.redirect('/admin');
            case 'doctor':
                return res.redirect('/doctor');
            case 'paciente':
                return res.redirect('/paciente');
            default:
                return res.redirect('/login');
        }

    } catch (error) {
        console.error('Errores al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
};