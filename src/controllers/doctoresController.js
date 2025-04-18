const mongoose = require('mongoose');
const Doctor = require('../models/doctores');
const Sucursal = require('../models/sucursales');
const Especialidad = require('../models/especialidades');
const BitacoraUso = require('../models/bitacoraUso');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');

exports.listar = async (req, res) => {
    try {
        const doctores = await Doctor.find()
            .populate('especialidadId')
            .populate('sucursalId')
            .populate('usuarioId');

        const sucursales = await Sucursal.find();
        const especialidades = await Especialidad.find();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio los Doctores',
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('index', {
            usuario: req.session.usuario,
            doctores,
            sucursales,
            especialidades,
            viewParcial: 'admin/doctores'
        });
    } catch (error) {
        console.error('Error al listar doctores:', error);
        res.status(500).send('Error al obtener los doctores');
    }
};

exports.crear = async (req, res) => {
    try {
        let { nombre, apellidos, email, telefono, sucursalId, estado } = req.body;
        let especialidadId = req.body['especialidadId[]'];

        if (!Array.isArray(especialidadId)) {
            especialidadId = [especialidadId];
        }

        especialidadId = especialidadId.map(id => new mongoose.Types.ObjectId(id));
        sucursalId = new mongoose.Types.ObjectId(sucursalId);

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.redirect('/admin/doctores?error=usuario');
        }

        const doctorExistente = await Doctor.findOne({ email });
        if (doctorExistente) {
            return res.redirect('/admin/doctores?error=doctor');
        }

        const hashedPassword = await bcrypt.hash('mediConnect01', 10);

        const nuevoUsuario = new Usuario({
            email,
            contraseña: hashedPassword,
            estado,
            rol: 'doctor',
            reinicioContraseña: true
        });

        const usuarioGuardado = await nuevoUsuario.save();

        const nuevoDoctor = new Doctor({
            nombre,
            apellidos,
            email,
            telefono,
            especialidadId,
            sucursalId,
            usuarioId: usuarioGuardado._id,
            estado
        });

        await nuevoDoctor.save();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Creó al doctor: ${nombre} ${apellidos} (${email})`,
            fechaHora: new Date()
        });

        await bitacora.save();

        res.redirect('/admin/doctores?agregado=1');
    } catch (error) {
        console.error('Error al crear doctor:', error);
        res.status(500).send('Error al crear el doctor');
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { nombre, apellidos, email, telefono, sucursalId, estado, reinicioContraseña } = req.body;
        let especialidadId = req.body['especialidadId[]'];

        let especialidadesArray = Array.isArray(especialidadId) ? especialidadId : [especialidadId];

        especialidadesArray = [...new Set(especialidadesArray.map(id => id.toString()))]
            .map(id => new mongoose.Types.ObjectId(id));

        const doctorActualizado = await Doctor.findByIdAndUpdate(req.params.id, {
            nombre,
            apellidos,
            email,
            telefono,
            especialidadId: especialidadesArray,
            sucursalId: new mongoose.Types.ObjectId(sucursalId),
            estado
        }, { new: true });

        if (doctorActualizado && doctorActualizado.usuarioId) {
            await Usuario.findByIdAndUpdate(doctorActualizado.usuarioId, {
                email,
                reinicioContraseña: !!reinicioContraseña,
                estado
            });
        }

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Actualizó al doctor: ${nombre} ${apellidos}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/doctores?editado=1');
    } catch (error) {
        console.error('Error al actualizar doctor:', error);
        res.status(500).send('Error al actualizar doctor');
    }
};

exports.eliminar = async (req, res) => {
    try {
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId).populate('usuarioId');
        if (!doctor) {
            return res.status(404).send('Doctor no encontrado');
        }

        // Eliminar el usuario
        if (doctor.usuarioId) {
            await Usuario.findByIdAndDelete(doctor.usuarioId._id);
        }

        // Eliminar el doctor
        await Doctor.findByIdAndDelete(doctorId);

        // Registrar en bitácora
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó al doctor: ${doctor.nombre} ${doctor.apellidos}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/doctores?eliminado=1');
    } catch (error) {
        console.error('Error al eliminar doctor:', error);
        res.status(500).send('Error al eliminar');
    }
};
