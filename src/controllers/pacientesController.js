const Paciente = require('../models/pacientes');
const BitacoraUso = require('../models/bitacoraUso');

exports.listar = async (req, res) => {
    try {
        const pacientes = await Paciente.find();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio los Pacientes',
            fechaHora: new Date()
        });
        await bitacora.save();

        res.render('index', {
            usuario: req.session.usuario,
            pacientes,
            viewParcial: 'admin/pacientes'
        });
    } catch (error) {
        console.error('Error al listar pacientes:', error);
        res.status(500).send('Error al obtener los pacientes');
    }
};

exports.crear = async (req, res) => {
    try {
        const { cedula, nombre, apellido, email, telefono, direccion, fechaNacimiento, historialMedico } = req.body;

        const cedulaExistente = await Paciente.findOne({ cedula });
        if (cedulaExistente) {
            return res.redirect('/admin/pacientes?error=cedula');
        }

        const emailExistente = await Paciente.findOne({ email });
        if (emailExistente) {
            return res.redirect('/admin/pacientes?error=email');
        }

        const nuevoPaciente = new Paciente({
            cedula,
            nombre,
            apellido,
            email,
            telefono,
            direccion,
            fechaNacimiento,
            historialMedico
        });

        await nuevoPaciente.save();

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Creó al paciente: ${nombre} ${apellido}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/pacientes?agregado=1');
    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(500).send('Error al crear el paciente');
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { cedula, nombre, apellido, email, telefono, direccion, fechaNacimiento, historialMedico } = req.body;

        await Paciente.findByIdAndUpdate(req.params.id, {
            cedula,
            nombre,
            apellido,
            email,
            telefono,
            direccion,
            fechaNacimiento,
            historialMedico
        });

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Actualizó al paciente: ${nombre} ${apellido}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/pacientes?editado=1');
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).send('Error al actualizar paciente');
    }
};

exports.eliminar = async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndDelete(req.params.id);

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó al paciente: ${paciente?.nombre || 'Desconocido'} ${paciente?.apellido || ''}`,
            fechaHora: new Date()
        });
        await bitacora.save();

        res.redirect('/admin/pacientes?eliminado=1');
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        res.status(500).send('Error al eliminar paciente');
    }
};
