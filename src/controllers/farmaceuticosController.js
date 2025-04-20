const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Farmaceutico = require('../models/farmaceuticos');
const Usuario = require('../models/usuarios');
const BitacoraUso = require('../models/bitacoraUso');
const bcrypt = require('bcrypt');

const Sucursal = mongoose.model('Sucursales');

exports.listar = async (req, res) => {
    try {
        const farmaceuticos = await Farmaceutico.find()
            .populate({ path: 'sucursalId', model: 'Sucursales' })
            .populate({ path: 'usuarioId', model: 'Usuarios' })

        const sucursales = await Sucursal.find();

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio los Farmacéuticos',
            fechaHora: new Date()
        }).save();

        res.render('index', {
            usuario: req.session.usuario,
            farmaceuticos,
            sucursales,
            viewParcial: 'admin/farmaceuticos'
        });
    } catch (error) {
        console.error('Error al listar farmacéuticos:', error);
        res.status(500).send('Error al obtener los farmacéuticos');
    }
};

exports.crear = async (req, res) => {
    try {
        const { nombre, apellidos, email, telefono, sucursalId, estado } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.redirect('/admin/farmaceuticos?error=usuario');
        }

        const farmaceuticoExistente = await Farmaceutico.findOne({ email });
        if (farmaceuticoExistente) {
            return res.redirect('/admin/farmaceuticos?error=farmaceutico');
        }

        const hashedPassword = await bcrypt.hash('mediConnect01', 10);

        const nuevoUsuario = new Usuario({
            email,
            contraseña: hashedPassword,
            estado,
            rol: 'farmaceutico',
            reinicioContraseña: true
        });

        const usuarioGuardado = await nuevoUsuario.save();

        const nuevoFarmaceutico = new Farmaceutico({
            nombre,
            apellidos,
            email,
            telefono,
            sucursalId: new ObjectId(sucursalId),
            usuarioId: usuarioGuardado._id,
            estado
        });

        await nuevoFarmaceutico.save();

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Creó al farmacéutico: ${nombre} ${apellidos} (${email})`,
            fechaHora: new Date()
        }).save();

        res.redirect('/admin/farmaceuticos?agregado=1');
    } catch (error) {
        console.error('Error al crear farmacéutico:', error);
        res.status(500).send('Error al crear el farmacéutico');
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { nombre, apellidos, email, telefono, sucursalId, estado, reinicioContraseña } = req.body;

        const farmaceuticoActualizado = await Farmaceutico.findByIdAndUpdate(req.params.id, {
            nombre,
            apellidos,
            email,
            telefono,
            sucursalId: new ObjectId(sucursalId),
            estado
        }, { new: true });

        if (farmaceuticoActualizado?.usuarioId) {
            await Usuario.findByIdAndUpdate(farmaceuticoActualizado.usuarioId, {
                email,
                reinicioContraseña: !!reinicioContraseña,
                estado
            });
        }

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Actualizó al farmacéutico: ${nombre} ${apellidos}`,
            fechaHora: new Date()
        }).save();

        res.redirect('/admin/farmaceuticos?editado=1');
    } catch (error) {
        console.error('Error al actualizar farmacéutico:', error);
        res.status(500).send('Error al actualizar farmacéutico');
    }
};

exports.eliminar = async (req, res) => {
    try {

        const farmaceutico = await Farmaceutico.findById(req.params.id).populate({
            path: 'usuarioId',
            model: 'Usuarios'
        });

        if (!farmaceutico) {
            return res.status(404).send('Farmacéutico no encontrado');
        }

        if (farmaceutico.usuarioId) {
            await Usuario.findByIdAndDelete(farmaceutico.usuarioId._id);
        }

        await Farmaceutico.findByIdAndDelete(req.params.id);

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó al farmacéutico: ${farmaceutico.nombre} ${farmaceutico.apellidos}`,
            fechaHora: new Date()
        }).save();

        res.redirect('/admin/farmaceuticos?eliminado=1');
    } catch (error) {
        console.error('Error al eliminar farmacéutico:', error);
        res.status(500).send('Error al eliminar');
    }
};