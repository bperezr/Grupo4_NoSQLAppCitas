const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarRol } = require('../middleware/verificarRol');

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

router.get('/doctor', verificarRol('doctor'), (req, res) => {
    res.render('index', {
        usuario: req.session.usuario,
        viewParcial: 'doctor/inicio',
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

module.exports = router;