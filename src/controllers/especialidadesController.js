const Especialidades = require('../models/especialidades');
const BitacoraUso = require('../models/bitacoraUso');

// Obtener todas las especialidades
exports.getEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidades.find()

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio las especialidades',
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render("index", {
            usuario: req.session.usuario,
            especialidades,
            viewParcial: "admin/especialidades",
        });
    } catch (error) {
        console.error('Error al obtener las especialidades:', error);
        res.status(500).send('Error al obtener las especialidades');
    }
};

// Crear especialidad
exports.crearEspecialidad = async (req, res) => {
    try {
        const { nombreEspecialidad, descripcion, precioConsulta } = req.body;

        const nuevaEspecialidad = new Especialidades({
            nombreEspecialidad,
            descripcion,
            precioConsulta: parseFloat(precioConsulta)
        });

        await nuevaEspecialidad.save();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Agregó una especialidad: ${nuevaEspecialidad.nombreEspecialidad}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/especialidades?agregado=1');
    } catch (error) {
        console.error('Error al crear la especialidad:', error);
        res.status(500).send('Error al crear la especialidad');
    }
};

// Actualizar especialidad
exports.actualizarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreEspecialidad, descripcion, precioConsulta } = req.body;

        await Especialidades.findByIdAndUpdate(id, {
            nombreEspecialidad,
            descripcion,
            precioConsulta: parseFloat(precioConsulta)
        });

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Editó la especialidad: ${nombreEspecialidad}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/especialidades?editado=1');
    } catch (error) {
        console.error('Error al actualizar la especialidad:', error);
        res.status(500).send('Error al actualizar la especialidad');
    }
};

// Eliminar especialidad
exports.eliminarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;

        const especialidad = await Especialidades.findById(id);
        if (!especialidad) {
            return res.status(404).send('Especialidad no encontrada');
        }

        await Especialidades.findByIdAndDelete(id);

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó la especialidad: ${especialidad.nombreEspecialidad}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/especialidades?eliminado=1');

    } catch (error) {
        console.error('Error al eliminar la especialidad:', error);
        res.status(500).send('Error al eliminar la especialidad');
    }
};
