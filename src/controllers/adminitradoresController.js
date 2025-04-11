const { ObjectId } = require('mongoose').Types;
const Usuario = require('../models/usuarios');
const BitacoraUso = require('../models/bitacoraUso');
const bcrypt = require('bcryptjs');

// Listar solo usuarios con rol admin
exports.listar = async (req, res) => {
    try {
        const administradores = await Usuario.find({ rol: 'admin' });

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio los administradores',
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('index', {
            usuario: req.session.usuario,
            administradores,
            viewParcial: 'admin/administradores',
        });
    } catch (error) {
        console.error('Error al listar administradores:', error);
        res.status(500).send('Error al obtener los administradores');
    }
};

// Crear usuario con rol admin
exports.crear = async (req, res) => {
    try {
        const { email, estado } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedAdmin = await bcrypt.hash('mediConnect01', salt);

        const nuevoAdmin = new Usuario({
            email,
            contraseña: hashedAdmin,
            estado,
            rol: 'admin',
            reinicioContraseña: true
        });

        await nuevoAdmin.save();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Creó el administrador: ${email}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/administradores?agregado=1');
    } catch (error) {
        console.error('Error al crear administrador:', error);

        if (error.message.includes('E11000')) {
            res.status(400).send('Error de duplicado en los datos del administrador');
        } else {
            res.status(500).send('Error al crear el administrador');
        }
    }
};

// Actualizar solo usuarios con rol admin
exports.actualizar = async (req, res) => {
    try {
        const { email, estado } = req.body;

        const reinicio = req.body.reinicioContraseña === 'on';

        const admin = await Usuario.findOneAndUpdate(
            { _id: req.params.id, rol: 'admin' },
            {
                email,
                estado,
                reinicioContraseña: reinicio
            },
            { new: true }
        );

        if (!admin) {
            return res.status(404).send('Administrador no encontrado');
        }

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Actualizó el administrador: ${email}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/administradores?editado=1');
    } catch (error) {
        console.error('Error al actualizar administrador:', error);
        res.status(500).send('Error al actualizar');
    }
};

// Eliminar solo usuarios con rol admin
exports.eliminar = async (req, res) => {
    try {
        const admin = await Usuario.findOne({ _id: req.params.id, rol: 'admin' });

        if (!admin) {
            return res.status(404).send('Administrador no encontrado');
        }

        await Usuario.findByIdAndDelete(admin._id);

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó el administrador: ${admin.nombre}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/administradores');
    } catch (error) {
        console.error('Error al eliminar administrador:', error);
        res.status(500).send('Error al eliminar');
    }
};
