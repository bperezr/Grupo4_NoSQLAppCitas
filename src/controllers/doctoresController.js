const Doctor = require('../models/doctores');

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
        res.render('admin/doctores', { doctores });
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
        res.render('editarDoctor', { doctor });
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
        res.redirect('/doctores');
    } catch (error) {
        console.error('Error al actualizar el doctor:', error);
        res.status(500).send('Error al actualizar el doctor');
    }
};