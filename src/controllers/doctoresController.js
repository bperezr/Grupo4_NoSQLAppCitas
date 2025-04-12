const Doctor = require('../models/doctores');
const Sucursal = require('../models/sucursales');
const BitacoraUso = require('../models/bitacoraUso');

// Obtener todos los doctores
exports.getDoctoresCitas = async (req, res) => {
    try {
        const doctores = await Doctor.find({ estado: 'activo' }); 
        res.status(200).json(doctores);
    } catch (error) {
        console.error('Error al obtener doctores:', error);
        res.status(500).json({ message: 'Error al obtener doctores' });
    }
};

// Obtener todos los doctores
exports.getDoctores = async (req, res) => {
    try {
        const doctores = await Doctor.find().populate('sucursalId', 'nombre');
        const sucursales = await Sucursal.find(); 

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio los doctores',
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render("index", {
          usuario: req.session.usuario,
          doctores,
          sucursales,
          viewParcial: "admin/doctores",
        });
    } catch (error) {
        console.error('Error al obtener doctores:', error);
        res.status(500).send('Error al obtener doctores');
    }
};


// Crear un nuevo doctor
exports.crearDoctor = async (req, res) => {
    try {
        const { nombre, apellido, email, especialidad, sucursalId, horarioAtencion } = req.body;
        const nuevoDoctor = new Doctor({
            nombre,
            apellido,
            email,
            especialidad,
            sucursalId,
            horarioAtencion,
            estado: 'activo'
        });

        const tipoAccion = `Agregó al doctor: ${nuevoDoctor.nombre}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();

        await nuevoDoctor.save();
        res.redirect('/doctores');
    } catch (error) {
        console.error('Error al crear el doctor:', error);
        res.status(500).send('Error al crear el doctor');
    }
};

// Activar un doctor
exports.activarDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await Doctor.findByIdAndUpdate(id, { estado: 'activo' });
        const tipoAccion = `Activo al doctor: ${Doctor.nombre}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();
        res.redirect('/doctores');
    } catch (error) {
        console.error('Error al activar el doctor:', error);
        res.status(500).send('Error al activar el doctor');
    }
};

// Desactivar un doctor
exports.desactivarDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await Doctor.findByIdAndUpdate(id, { estado: 'inactivo' });
        const tipoAccion = `Desactivo al doctor: ${Doctor.nombre}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();
        res.redirect('/doctores');
    } catch (error) {
        console.error('Error al desactivar el doctor:', error);
        res.status(500).send('Error al desactivar el doctor');
    }
};

// Editar un doctor
exports.editarDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        const sucursales = await Sucursal.find();
        const tipoAccion = `Editó al doctor: ${Doctor.nombre}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('admin/editarDoctor', { doctor, sucursales }); 
    } catch (error) {
        console.error('Error al obtener el doctor:', error);
        res.status(500).send('Error al obtener el doctor');
    }
};

// Actualizar los datos de un doctor
exports.actualizarDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, especialidad, sucursalId, horarioAtencion } = req.body;
        await Doctor.findByIdAndUpdate(id, {
            nombre,
            apellido,
            email,
            especialidad,
            sucursalId,
            horarioAtencion
        });
        const tipoAccion = `Editó al doctor: ${Doctor.nombre}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();
        res.redirect('/doctores');
    } catch (error) {
        console.error('Error al actualizar el doctor:', error);
        res.status(500).send('Error al actualizar el doctor');
    }
};