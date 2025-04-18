const Usuario = require('../models/usuarios');
const Doctor = require('../models/doctores');
const bcrypt = require('bcrypt');
const BitacoraUso = require('../models/bitacoraUso');

exports.login = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.redirect('/login?error=usuario');
        }

        if (usuario.estado === 'inactivo') {
            await new BitacoraUso({
                usuarioId: usuario._id,
                tipoAccion: 'Intento de inicio con cuenta inactiva',
                fechaHora: new Date()
            }).save();

            return res.redirect('/login?error=inactivo');
        }

        const match = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!match) {
            await new BitacoraUso({
                usuarioId: usuario._id,
                tipoAccion: 'Intento fallido de inicio (contraseña incorrecta)',
                fechaHora: new Date()
            }).save();

            return res.redirect('/login?error=clave');
        }

        if (usuario.reinicioContraseña === true) {
            req.session.usuarioTemporal = {
                id: usuario._id,
                email: usuario.email
            };

            await new BitacoraUso({
                usuarioId: usuario._id,
                tipoAccion: 'Inicio exitoso con requerimiento de cambio de contraseña',
                fechaHora: new Date()
            }).save();

            return res.redirect('/cambiar-contrasena');
        }

        let idDoctor = null;
        if (usuario.rol === 'doctor') {
            const doctorRelacionado = await Doctor.findOne({ usuarioId: usuario._id });
            if (doctorRelacionado) {
                idDoctor = doctorRelacionado._id;
            }
        }

        req.session.usuario = {
            id: usuario._id,
            email: usuario.email,
            rol: usuario.rol,
            idDoctor
        };

        await new BitacoraUso({
            usuarioId: usuario._id,
            tipoAccion: 'Inicio de sesión exitoso',
            fechaHora: new Date()
        }).save();

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
