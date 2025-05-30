const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Doctor = require('../models/doctores');
const Sucursal = require('../models/sucursales');
const Especialidad = require('../models/especialidades');
const BitacoraUso = require('../models/bitacoraUso');
const Usuario = require('../models/usuarios');
const Receta = require('../models/recetas');
const Medicamento = require('../models/medicamentos');
const bcrypt = require('bcrypt');


// ------------------------------------------------ Controladores para rol de admin

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

exports.listarDoctoresPorEspecialidad = async (req, res) => {
    try {
        const { especialidad, sucursal } = req.params;

        if (!especialidad) {
            return res.status(400).json({ error: 'Falta el parámetro especialidad' });
        }

        if (!mongoose.Types.ObjectId.isValid(especialidad)) {
            return res.status(400).json({ error: 'ID de especialidad inválido' });
        }

        if (!mongoose.Types.ObjectId.isValid(sucursal)) {
            return res.status(400).json({ error: 'ID de sucursal inválido' });
        }

        const docs = await Doctor.find({
            especialidadId: new mongoose.Types.ObjectId(`${especialidad}`),
            sucursalId: new mongoose.Types.ObjectId(`${sucursal}`)
        });

        return res.json(docs);
    } catch (error) {
        console.error('Error al listar doctores por especialidad:', error);
        return res.status(500).json({ error: 'Error interno al obtener doctores' });
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

        if (doctor.usuarioId) {
            await Usuario.findByIdAndDelete(doctor.usuarioId._id);
        }

        await Doctor.findByIdAndDelete(doctorId);

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

// ------------------------------------------------ Controladores para rol de doctor

exports.vistaDashboard = async (req, res) => {
    try {
        const doctorId = req.session.usuario.idDoctor;

        const ahoraCR = new Date().toLocaleString("en-US", { timeZone: "America/Costa_Rica" });
        const hoyCR = new Date(ahoraCR);

        const inicioDiaLocal = new Date(hoyCR.setHours(0, 0, 0, 0));
        const finDiaLocal = new Date(hoyCR.setHours(23, 59, 59, 999));


        const Cita = require('../models/citas');

        const citasHoy = await Cita.find({
            doctorId: doctorId,
            fechaHora: { $gte: inicioDiaLocal, $lte: finDiaLocal }
        })
            .populate('pacienteId', 'nombre apellidos telefono cedula')
            .sort({ fechaHora: 1 });

        const totalCompletada = citasHoy.filter(c => ['completada'].includes(c.estado)).length;
        const totalCancelada = citasHoy.filter(c => ['cancelada'].includes(c.estado)).length;
        const totalPendientes = citasHoy.filter(c => ['pendiente', 'confirmada'].includes(c.estado)).length;

        const citasPorEspecialidad = await Cita.aggregate([
            {
                $match: {
                    doctorId: new ObjectId(doctorId),
                    fechaHora: { $gte: inicioDiaLocal, $lte: finDiaLocal }
                }
            }
            ,
            {
                $group: {
                    _id: "$especialidadId",
                    total: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "Especialidades",
                    localField: "_id",
                    foreignField: "_id",
                    as: "especialidad"
                }
            },
            { $unwind: "$especialidad" },
            {
                $project: {
                    _id: 0,
                    especialidad: "$especialidad.nombreEspecialidad",
                    total: 1
                }
            }
        ]);

        const labelsEspecialidades = citasPorEspecialidad.map(e => e.especialidad);
        const datosEspecialidades = citasPorEspecialidad.map(e => e.total);

        res.render('index', {
            usuario: req.session.usuario,
            viewParcial: 'doctor/inicio',
            citasHoy,
            labelsEspecialidades: JSON.stringify(labelsEspecialidades),
            datosEspecialidades: JSON.stringify(datosEspecialidades),
            totalPendientes,
            totalCompletada,
            totalCancelada,
            request: req
        });

    } catch (error) {
        console.error('❌ Error al cargar dashboard del doctor:', error);
        res.status(500).send('Error al cargar el dashboard');
    }
};

exports.vistaCitasPendientes = async (req, res) => {
    try {
        const doctorId = req.session.usuario.idDoctor;

        const ahoraCR = new Date().toLocaleString("en-US", { timeZone: "America/Costa_Rica" });
        const hoyCR = new Date(ahoraCR);
        const inicioDia = new Date(hoyCR.setHours(0, 0, 0, 0));
        const finDia = new Date(hoyCR.setHours(23, 59, 59, 999));

        const Cita = require('../models/citas');
        const Especialidad = require('../models/especialidades');
        const Receta = require('../models/recetas');

        const citas = await Cita.find({
            doctorId: doctorId,
            fechaHora: { $gte: inicioDia, $lte: finDia },
            $or: [
                { estado: 'pendiente' },
                { estado: 'confirmada' }
            ]
        })
            .populate('pacienteId', 'nombre apellido cedula telefono email direccion fechaNacimiento')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'sucursalId',
                    select: 'nombre direccion telefono'
                }
            })
            .sort({ fechaHora: 1 });

        const especialidades = await Especialidad.find({}, 'nombreEspecialidad');
        const mapaEspecialidades = {};
        especialidades.forEach(e => {
            mapaEspecialidades[e._id.toString()] = e.nombreEspecialidad;
        });

        const recetaPorCita = {};
        const recetas = await Receta.find({
            citaId: { $in: citas.map(c => c._id) }
        }).populate('medicamentos.medicamentoId', 'nombre');

        recetas.forEach(receta => {
            const key = receta.citaId.toString();
            if (!recetaPorCita[key]) recetaPorCita[key] = [];
            recetaPorCita[key].push(receta.toObject());
        });

        const citasConExtras = citas.map(cita => {
            const citaObj = cita.toObject();
            return {
                ...citaObj,
                nombreEspecialidad: mapaEspecialidades[citaObj.especialidadId?.toString()] || '---',
                sucursalNombre: citaObj.doctorId?.sucursalId?.nombre || '---',
                recetas: recetaPorCita[citaObj._id.toString()] || []
            };
        });

        res.render('index', {
            usuario: req.session.usuario,
            viewParcial: 'doctor/citasPendientes',
            citas: citasConExtras,
            request: req
        });

    } catch (error) {
        console.error('❌ Error al cargar vista de citas pendientes:', error);
        res.status(500).send('Error al cargar las citas del día');
    }
};

exports.vistaHistorialCitas = async (req, res) => {
    try {
        const doctorId = req.session.usuario.idDoctor;

        const ahoraCR = new Date().toLocaleString("en-US", { timeZone: "America/Costa_Rica" });
        const hoyCR = new Date(ahoraCR);
        const inicioDia = new Date(hoyCR.setHours(0, 0, 0, 0));
        const finDia = new Date(hoyCR.setHours(23, 59, 59, 999));

        const Cita = require('../models/citas');
        const Especialidad = require('../models/especialidades');
        const Receta = require('../models/recetas');

        const citas = await Cita.find({
            doctorId: doctorId,
            fechaHora: { $gte: inicioDia, $lte: finDia },
            $and: [
                { estado: { $ne: 'pendiente' } },
                { estado: { $ne: 'confirmada' } }
            ]
        })
            .populate('pacienteId', 'nombre apellido cedula telefono email direccion fechaNacimiento')
            .populate({
                path: 'doctorId',
                select: 'nombre apellidos email',
                populate: {
                    path: 'sucursalId',
                    select: 'nombre direccion telefono'
                }
            })
            .sort({ fechaHora: 1 });

        const especialidades = await Especialidad.find({}, 'nombreEspecialidad');
        const mapaEspecialidades = {};
        especialidades.forEach(e => {
            mapaEspecialidades[e._id.toString()] = e.nombreEspecialidad;
        });

        const recetaPorCita = {};
        const recetas = await Receta.find({
            citaId: { $in: citas.map(c => c._id) }
        }).populate('medicamentos.medicamentoId', 'nombre');

        recetas.forEach(receta => {
            const key = receta.citaId.toString();
            if (!recetaPorCita[key]) recetaPorCita[key] = [];
            recetaPorCita[key].push(receta.toObject());
        });

        const citasConExtras = citas.map(cita => {
            const citaObj = cita.toObject();
            return {
                ...citaObj,
                nombreEspecialidad: mapaEspecialidades[citaObj.especialidadId?.toString()] || '---',
                sucursalNombre: citaObj.doctorId?.sucursalId?.nombre || '---',
                recetas: recetaPorCita[citaObj._id.toString()] || []
            };
        });

        res.render('index', {
            usuario: req.session.usuario,
            viewParcial: 'doctor/historialCitasDoc',
            citas: citasConExtras,
            request: req
        });

    } catch (error) {
        console.error('❌ Error al cargar el historial de citas:', error);
        res.status(500).send('Error al cargar las citas del día');
    }
};



exports.vistaAtenderCita = async (req, res) => {
    try {
        const citaId = req.params.id;
        const Cita = require('../models/citas');
        const BitacoraUso = require('../models/bitacoraUso');
        const Receta = require('../models/recetas');

        const cita = await Cita.findById(citaId)
            .populate('pacienteId', 'nombre apellido cedula telefono email direccion fechaNacimiento')
            .populate('especialidadId', 'nombreEspecialidad')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'sucursalId',
                    select: 'nombre direccion telefono'
                }
            });

        if (!cita) return res.status(404).send('Cita no encontrada');

        const recetas = await Receta.find({ citaId: cita._id })
            .populate('medicamentos.medicamentoId', 'nombre descripcion');

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Ingresó a la cita (${cita._id}) del paciente: ${cita.pacienteId?.nombre} ${cita.pacienteId?.apellido}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('index', {
            usuario: req.session.usuario,
            cita,
            recetas,
            viewParcial: 'doctor/atenderCita',
            request: req
        });

    } catch (error) {
        console.error('❌ Error al cargar vista para atender cita:', error);
        res.status(500).send('Error al cargar la vista');
    }
};

exports.procesarAtencionCita = async (req, res) => {
    try {
        const { notas, estado } = req.body;
        const citaId = req.params.id;

        const Cita = require('../models/citas');
        const BitacoraUso = require('../models/bitacoraUso');

        const citaActualizada = await Cita.findByIdAndUpdate(citaId, {
            notas,
            estado
        }, { new: true }).populate('pacienteId', 'nombre apellido');

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Atendió la cita (${citaActualizada._id}) de ${citaActualizada.pacienteId?.nombre} ${citaActualizada.pacienteId?.apellido} y la marcó como ${estado}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        const redirectPath = estado === 'completada'
            ? '/doctor/citas?atendida=1'
            : '/doctor/citas?cancelada=1';

        res.redirect(redirectPath);
    } catch (error) {
        console.error('❌ Error al guardar atención de la cita:', error);
        res.status(500).send('Error al procesar la atención');
    }
};

exports.eliminarReceta = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const recetaId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(recetaId)) {
            return res.status(400).json({ error: 'ID de receta inválido' });
        }

        const receta = await Receta.findById(recetaId).session(session);
        if (!receta) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        // Restaurar stock
        for (const item of receta.medicamentos) {
            const medicamento = await Medicamento.findById(item.medicamentoId).session(session);
            if (medicamento) {
                medicamento.stock += item.cantidad;
                await medicamento.save({ session });
            }
        }

        // Eliminar receta
        await Receta.findByIdAndDelete(recetaId).session(session);

        await session.commitTransaction();
        session.endSession();

        res.json({ mensaje: 'Receta eliminada correctamente y stock restaurado' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('❌ Error al eliminar receta:', error);
        res.status(500).json({ error: 'No se pudo eliminar la receta' });
    }
};