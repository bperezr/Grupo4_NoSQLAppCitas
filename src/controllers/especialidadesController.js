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

// Crear una nueva especialidad
exports.crearEspecialidad = async (req, res) => {
    try {
        const { nombreEspecialidad, descripcion, precioConsulta } = req.body;
        const nuevaEspecialidad = new Especialidades({
            nombreEspecialidad,
            descripcion,
            precioConsulta:  parseFloat(precioConsulta)
        });

        const tipoAccion = `Agregó una especialidad: ${nuevaEspecialidad.nombreEspecialidad}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();

        await nuevaEspecialidad.save();
        res.redirect('/especialidades');
    } catch (error) {
        console.error('Error al crear la especialidad:', error);
        res.status(500).send('Error al crear la especialidad');
    }
};

// Editar una especialidad
exports.editarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const especialidad = await Especialidades.findById(id);
        const tipoAccion = `Editó la especialidad: ${especialidad.nombreEspecialidad}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('admin/editarEspecialidad', { especialidad }); 
    } catch (error) {
        console.error('Error al obtener la especialidad:', error);
        res.status(500).send('Error al obtener la especilidad');
    }
};

// Actualizar los datos de una especilidad
exports.actualizarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreEspecialidad, descripcion, precioConsulta } = req.body;
        await Especialidades.findByIdAndUpdate(id, {
            nombreEspecialidad,
            descripcion,
            precioConsulta:  parseFloat(precioConsulta)
        });
        const especialidad = await Especialidades.findById(id); 
        const tipoAccion = `Editó la especilidad: ${especialidad.nombreEspecialidad}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();
        res.redirect('/especialidades');
    } catch (error) {
        console.error('Error al actualizar la especialidad:', error);
        res.status(500).send('Error al actualizar la especilidad');
    }
};

// Eliminar una especialidad
exports.eliminarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;

        const especialidad = await Especialidades.findById(id);
        if (!especialidad) {
            return res.status(404).send('Especialidad no encontrada');
        }

        const tipoAccion = `Eliminó la especialidad: ${especialidad.nombreEspecialidad}`;
        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: tipoAccion,
            fechaHora: new Date()
        });
        await bitacora.save();

        await Especialidades.findByIdAndDelete(id);

        res.redirect('/especialidades');
    } catch (error) {
        console.error('Error al eliminar la especialidad:', error);
        res.status(500).send('Error al eliminar la especialidad');
    }
};
