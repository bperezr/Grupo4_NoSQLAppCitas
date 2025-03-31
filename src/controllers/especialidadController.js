const { ObjectId } = require('mongoose').Types;
const Especialidad = require('../models/especialidades');
const BitacoraUso = require('../models/bitacoraUso');

exports.listar = async (req, res) => {
    try {
        const especialidades = await Especialidad.find();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio las Especialidades',
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('index', {
            usuario: req.session.usuario,
            especialidades,
            viewParcial: 'admin/especialidades',
        });
    } catch (error) {
        console.error('Error al listar especialidades:', error);
        res.status(500).send('Error al obtener las especialidades');
    }
};

exports.crear = async (req, res) => {
    try {
        req.body.precioConsulta = parseFloat(req.body.precioConsulta);

        const nueva = new Especialidad(req.body);
        await nueva.save();

        const tipoAccion = `Creó la especialidad: ${nueva.nombreEspecialidad}`;

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });

        await bitacora.save();

        res.redirect('/admin/especialidades');
    } catch (error) {
        console.error('Error al crear especialidad o registrar en la bitácora:', error);

        if (error.message.includes('E11000')) {
            res.status(400).send('Error de duplicado en los datos de la especialidad');
        } else if (error.message.includes('validation')) {
            res.status(400).send('Datos inválidos. Verifica que todos los campos estén completos y el precio sea numérico.');
        } else {
            res.status(500).send('Error al crear especialidad o registrar la acción en la bitácora');
        }
    }
};


exports.actualizar = async (req, res) => {
    try {
        const especialidad = await Especialidad.findByIdAndUpdate(req.params.id, req.body, { new: true });

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Actualizó la especialidad: ${especialidad.nombreEspecialidad}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/especialidades?editado=1');
    } catch (error) {
        console.error('Error al actualizar especialidad:', error);
        res.status(500).send('Error al actualizar');
    }
};

exports.eliminar = async (req, res) => {
    try {
        const especialidadId = req.params.id;

        const especialidad = await Especialidad.findById(especialidadId);
        if (!especialidad) {
            return res.status(404).send('Especialidad no encontrada');
        }

        await Especialidad.findByIdAndDelete(especialidadId);

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó la especialidad: ${especialidad.nombreEspecialidad}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/especialidades');
    } catch (error) {
        console.error('Error al eliminar especialidad:', error);
        res.status(500).send('Error al eliminar');
    }
};