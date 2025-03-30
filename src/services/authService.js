const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (email, contraseña) => {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
        {
            id: usuario._id,
            rol: usuario.rol,
            email: usuario.email
        },
        'clave_secreta',
        { expiresIn: '2h' }
    );

    return {
        token,
        usuario: {
            id: usuario._id,
            email: usuario.email,
            rol: usuario.rol
        }
    };
};

module.exports = { login };