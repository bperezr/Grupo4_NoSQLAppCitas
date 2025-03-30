const { ObjectId } = require('mongoose').Types;
const Sucursal = require('../models/sucursales');
const BitacoraUso = require('../models/bitacoraUso');

exports.listar = async (req, res) => {
    try {
        const sucursales = await Sucursal.find();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio las Sucursales',
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('index', {
            usuario: req.session.usuario,
            sucursales,
            viewParcial: 'admin/sucursales',
        });
    } catch (error) {
        console.error('Error al listar sucursales:', error);
        res.status(500).send('Error al obtener las sucursales');
    }
};

exports.crear = async (req, res) => {
    try {
        const nueva = new Sucursal(req.body);
        await nueva.save();

        const tipoAccion = `Creó la sucursal: ${nueva.nombre}`;

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });

        await bitacora.save();

        res.redirect('/admin/sucursales');
    } catch (error) {
        console.error('Error al crear sucursal o registrar en la bitácora:', error);

        if (error.message.includes('E11000')) {
            res.status(400).send('Error de duplicado en los datos de la sucursal');
        } else {
            res.status(500).send('Error al crear sucursal o registrar la acción en la bitácora');
        }
    }
};

exports.verSucursal = async (req, res) => {
    try {
        const sucursal = await Sucursal.findById(req.params.id);
        if (!sucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Abrió la sucursal: ${sucursal.nombre}`
        });
        await bitacora.save();

        res.render('index', {
            usuario: req.session.usuario,
            sucursal,
            viewParcial: 'admin/editar-sucursal',
        });
    } catch (error) {
        console.error('Error al obtener la sucursal para editar:', error);
        res.status(500).send('Error al obtener la sucursal');
    }
};

exports.actualizar = async (req, res) => {
    try {
        const sucursal = await Sucursal.findByIdAndUpdate(req.params.id, req.body, { new: true });

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Actualizó sucursal: ${sucursal.nombre}`
        });
        await bitacora.save();

        res.redirect('/admin/sucursales');
    } catch (error) {
        console.error('Error al actualizar sucursal:', error);
        res.status(500).send('Error al actualizar');
    }
};

exports.eliminar = async (req, res) => {
    try {
        const sucursalId = req.params.id;

        const sucursal = await Sucursal.findById(sucursalId);
        if (!sucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }

        await Sucursal.findByIdAndDelete(sucursalId);

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó la sucursal: ${sucursal.nombre}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/sucursales');
    } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        res.status(500).send('Error al eliminar');
    }
};