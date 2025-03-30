const Sucursal = require('../models/sucursales');

exports.listar = async (req, res) => {
    try {
        const sucursales = await Sucursal.find();
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
        res.redirect('/admin/sucursales');
    } catch (error) {
        console.error('Error al crear sucursal:', error);
        res.status(500).send('Error al crear sucursal');
    }
};

exports.editar = async (req, res) => {
    try {
        const sucursal = await Sucursal.findById(req.params.id);
        if (!sucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }
        // Pasamos la sucursal como parte del contexto de la vista parcial
        res.render('index', {
            usuario: req.session.usuario,
            sucursal,
            viewParcial: 'admin/editar-sucursal', // Aquí pasamos la vista de edición
        });
    } catch (error) {
        console.error('Error al obtener la sucursal para editar:', error);
        res.status(500).send('Error al obtener la sucursal');
    }
};

exports.actualizar = async (req, res) => {
    try {
        await Sucursal.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/sucursales');
    } catch (error) {
        console.error('Error al actualizar sucursal:', error);
        res.status(500).send('Error al actualizar');
    }
};

exports.eliminar = async (req, res) => {
    try {
        await Sucursal.findByIdAndDelete(req.params.id);
        res.redirect('/admin/sucursales');
    } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        res.status(500).send('Error al eliminar');
    }
};
