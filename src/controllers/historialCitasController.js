const mongoose = require('mongoose');

// ------------------------------------------------ Controladores para rol de admin

exports.vistaHistorialTodasCitas = async (req, res) => {
    try {
        const ahoraCR = new Date().toLocaleString("en-US", { timeZone: "America/Costa_Rica" });
        const hoyCR = new Date(ahoraCR);
        const inicioDia = new Date(hoyCR.setHours(0, 0, 0, 0));
        const finDia = new Date(hoyCR.setHours(23, 59, 59, 999));

        const Cita = require('../models/citas');
        const Especialidad = require('../models/especialidades');
        const Receta = require('../models/recetas');

        const citas = await Cita.find({
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
            viewParcial: 'admin/historialCitas',
            citas: citasConExtras,
            request: req
        });

    } catch (error) {
        console.error('❌ Error al cargar el historial de citas:', error);
        res.status(500).send('Error al cargar las citas del día');
    }
};