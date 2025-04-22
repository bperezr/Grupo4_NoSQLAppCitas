const BitacoraUso = require('../models/bitacoraUso');
const Usuario = require('../models/usuarios');

exports.listar = async (req, res) => {
    try {
        const registros = await BitacoraUso.aggregate([
            {
                $lookup: {
                    from: 'Usuarios',
                    localField: 'usuarioId',
                    foreignField: '_id',
                    as: 'usuarioInfo'
                }
            },
            {
                $unwind: '$usuarioInfo'
            },
            {
                $project: {
                    'usuarioInfo.email': 1,
                    'usuarioInfo.rol': 1,
                    tipoAccion: 1,
                    fechaHora: 1
                }
            },
            {
                $sort: { fechaHora: -1 }
            }
        ]);

        res.render('index', {
            usuario: req.session.usuario,
            registros: registros,
            viewParcial: 'admin/bitacora'
        });
    } catch (error) {
        console.error('Error al obtener registros de la bitácora:', error);
        res.status(500).send('Error al obtener registros');
    }
};


exports.eliminarTodos = async (req, res) => {
    try {
        await BitacoraUso.deleteMany({});

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Se eliminaron todos los registros`,
            fechaHora: new Date()
        });

        await bitacora.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar los registros:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar los registros' });
    }
};
