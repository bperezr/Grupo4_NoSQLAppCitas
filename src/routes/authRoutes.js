const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarRol } = require('../middleware/verificarRol');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios');

function redirigirPorRol(usuario, res) {
    if (!usuario) return res.redirect('/login');

    switch (usuario.rol) {
        case 'admin': return res.redirect('/admin');
        case 'doctor': return res.redirect('/doctor');
        case 'paciente': return res.redirect('/paciente');
        default: return res.redirect('/login');
    }
}

router.post('/login', authController.login);

router.get('/login', (req, res) => {
    if (req.session.usuario) {
        return redirigirPorRol(req.session.usuario, res);
    }
    res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

router.get('/', (req, res) => {
    if (req.session.usuario) {
        return redirigirPorRol(req.session.usuario, res);
    }
    res.redirect('/login');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

router.get('/admin', verificarRol('admin'), (req, res) => {
    res.render('index', {
        usuario: req.session.usuario,
        viewParcial: 'admin/inicio',
        request: req
    });
});

router.get('/paciente', verificarRol('paciente'), (req, res) => {
    res.render('index', {
        usuario: req.session.usuario,
        viewParcial: 'paciente/inicio',
        request: req
    });
});

// cambio de contraseña
router.get('/cambiar-contrasena', (req, res) => {
    if (!req.session.usuarioTemporal) {
        return res.redirect('/login');
    }
    res.render('cambiar-contrasena');
});

// cambio de contraseña
router.post('/cambiar-contrasena', async (req, res) => {
    const { nuevaContrasena } = req.body;
    const usuarioTemp = req.session.usuarioTemporal;

    if (!usuarioTemp) {
        return res.redirect('/login');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(nuevaContrasena, salt);

        await Usuario.findByIdAndUpdate(usuarioTemp.id, {
            contraseña: hashed,
            reinicioContraseña: false
        });

        delete req.session.usuarioTemporal;

        res.redirect('/login?cambio=1');
    } catch (err) {
        console.error('Error al cambiar la contraseña:', err);
        res.status(500).send('Error al cambiar la contraseña');
    }
});

module.exports = router;