const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Farmaceutico = require('../models/farmaceuticos');
const Usuario = require('../models/usuarios');
const BitacoraUso = require('../models/bitacoraUso');
const Receta = require('../models/recetas');
const Medicamento = require('../models/medicamentos');
const Paciente = require('../models/pacientes');
const Doctor = require('../models/doctores');
const Especialidad = require('../models/especialidades');
const bcrypt = require('bcrypt');


const Sucursal = mongoose.model('Sucursales');

exports.listar = async (req, res) => {
    try {
        const farmaceuticos = await Farmaceutico.find()
            .populate({ path: 'sucursalId', model: 'Sucursales' })
            .populate({ path: 'usuarioId', model: 'Usuarios' })

        const sucursales = await Sucursal.find();

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio los Farmacéuticos',
            fechaHora: new Date()
        }).save();

        res.render('index', {
            usuario: req.session.usuario,
            farmaceuticos,
            sucursales,
            viewParcial: 'admin/farmaceuticos'
        });
    } catch (error) {
        console.error('Error al listar farmacéuticos:', error);
        res.status(500).send('Error al obtener los farmacéuticos');
    }
};

exports.crear = async (req, res) => {
    try {
        const { nombre, apellidos, email, telefono, sucursalId, estado } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.redirect('/admin/farmaceuticos?error=usuario');
        }

        const farmaceuticoExistente = await Farmaceutico.findOne({ email });
        if (farmaceuticoExistente) {
            return res.redirect('/admin/farmaceuticos?error=farmaceutico');
        }

        const hashedPassword = await bcrypt.hash('mediConnect01', 10);

        const nuevoUsuario = new Usuario({
            email,
            contraseña: hashedPassword,
            estado,
            rol: 'farmaceutico',
            reinicioContraseña: true
        });

        const usuarioGuardado = await nuevoUsuario.save();

        const nuevoFarmaceutico = new Farmaceutico({
            nombre,
            apellidos,
            email,
            telefono,
            sucursalId: new ObjectId(sucursalId),
            usuarioId: usuarioGuardado._id,
            estado
        });

        await nuevoFarmaceutico.save();

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Creó al farmacéutico: ${nombre} ${apellidos} (${email})`,
            fechaHora: new Date()
        }).save();

        res.redirect('/admin/farmaceuticos?agregado=1');
    } catch (error) {
        console.error('Error al crear farmacéutico:', error);
        res.status(500).send('Error al crear el farmacéutico');
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { nombre, apellidos, email, telefono, sucursalId, estado, reinicioContraseña } = req.body;

        const farmaceuticoActualizado = await Farmaceutico.findByIdAndUpdate(req.params.id, {
            nombre,
            apellidos,
            email,
            telefono,
            sucursalId: new ObjectId(sucursalId),
            estado
        }, { new: true });

        if (farmaceuticoActualizado?.usuarioId) {
            await Usuario.findByIdAndUpdate(farmaceuticoActualizado.usuarioId, {
                email,
                reinicioContraseña: !!reinicioContraseña,
                estado
            });
        }

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Actualizó al farmacéutico: ${nombre} ${apellidos}`,
            fechaHora: new Date()
        }).save();

        res.redirect('/admin/farmaceuticos?editado=1');
    } catch (error) {
        console.error('Error al actualizar farmacéutico:', error);
        res.status(500).send('Error al actualizar farmacéutico');
    }
};

exports.eliminar = async (req, res) => {
    try {

        const farmaceutico = await Farmaceutico.findById(req.params.id).populate({
            path: 'usuarioId',
            model: 'Usuarios'
        });

        if (!farmaceutico) {
            return res.status(404).send('Farmacéutico no encontrado');
        }

        if (farmaceutico.usuarioId) {
            await Usuario.findByIdAndDelete(farmaceutico.usuarioId._id);
        }

        await Farmaceutico.findByIdAndDelete(req.params.id);

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Eliminó al farmacéutico: ${farmaceutico.nombre} ${farmaceutico.apellidos}`,
            fechaHora: new Date()
        }).save();

        res.redirect('/admin/farmaceuticos?eliminado=1');
    } catch (error) {
        console.error('Error al eliminar farmacéutico:', error);
        res.status(500).send('Error al eliminar');
    }
};

//---------------------------------------------------------------------- Vistas de farmaceuticos

exports.listarRecetasSucursal = async (req, res) => {
    try {
        const idSucursal = req.session.usuario?.idSucursal;

        if (!idSucursal) {
            return res.status(403).send('Sucursal no disponible en la sesión.');
        }

        const recetas = await Receta.find({
            sucursalId: idSucursal,
            estado: { $in: ['Pendiente'] }
        })
            .populate('pacienteId', 'nombre apellido cedula email telefono direccion fechaNacimiento historialMedico')
            .populate({
                path: 'doctorId',
                select: 'nombre apellidos email telefono especialidadId sucursalId estado',
                populate: [
                    {
                        path: 'especialidadId',
                        model: 'Especialidades',
                        select: 'nombre'
                    },
                    {
                        path: 'sucursalId',
                        model: 'Sucursales',
                        select: 'nombre direccion telefono'
                    }
                ]
            })
            .populate('medicamentos.medicamentoId', 'nombre unidad marca tipo')
            .sort({ fechaCreacion: 1 });

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio las recetas de su sucursal',
            fechaHora: new Date()
        }).save();

        res.render('index', {
            usuario: req.session.usuario,
            recetas,
            viewParcial: 'farmaceutico/recetas'
        });
    } catch (error) {
        console.error('Error al listar recetas por sucursal:', error);
        res.status(500).send('Error al obtener las recetas');
    }
};


exports.atenderReceta = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const recetaId = req.params.id;
        const { estado, notaFarmaceutico } = req.body;

        if (!mongoose.Types.ObjectId.isValid(recetaId)) {
            return res.status(400).json({ error: 'ID de receta inválido' });
        }

        const receta = await Receta.findById(recetaId).session(session);
        if (!receta) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        if (receta.estado === 'Pendiente' && estado === 'Cancelado') {
            for (const item of receta.medicamentos) {
                const medicamento = await Medicamento.findById(item.medicamentoId).session(session);
                if (medicamento) {
                    medicamento.stock += item.cantidad;
                    await medicamento.save({ session });
                }
            }
        }

        receta.estado = estado;
        receta.notaFarmaceutico = notaFarmaceutico;
        if (estado === 'Entregado') {
            receta.fechaEntrega = new Date();
        }

        await receta.save({ session });

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Atendió receta ID ${recetaId} - Estado: ${estado}`,
            fechaHora: new Date()
        }).save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.json({ ok: true });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('❌ Error al atender receta:', error);
        return res.status(500).json({ error: 'Error al procesar la receta' });
    }
};


exports.listarRecetasSucursalHistorial = async (req, res) => {
    try {
        const idSucursal = req.session.usuario?.idSucursal;

        if (!idSucursal) {
            return res.status(403).send('Sucursal no disponible en la sesión.');
        }

        const recetas = await Receta.find({
            sucursalId: idSucursal,
            estado: { $in: ['Entregado', 'Cancelado'] }
        })
            .populate('pacienteId', 'nombre apellido cedula email telefono direccion fechaNacimiento historialMedico')
            .populate({
                path: 'doctorId',
                select: 'nombre apellidos email telefono especialidadId sucursalId estado',
                populate: [
                    {
                        path: 'especialidadId',
                        model: 'Especialidades',
                        select: 'nombre'
                    },
                    {
                        path: 'sucursalId',
                        model: 'Sucursales',
                        select: 'nombre direccion telefono'
                    }
                ]
            })
            .populate('medicamentos.medicamentoId', 'nombre unidad marca tipo')
            .sort({ fechaEntrega: -1 });

        await new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: 'Vio el historial de recetas completadas y canceladas de su sucursal',
            fechaHora: new Date()
        }).save();

        res.render('index', {
            usuario: req.session.usuario,
            recetas,
            viewParcial: 'farmaceutico/recetasHistorial'
        });
    } catch (error) {
        console.error('Error al listar recetas por sucursal:', error);
        res.status(500).send('Error al obtener las recetas');
    }
};