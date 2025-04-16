const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const sucursalesRoutes = require('./routes/sucursalesRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
const citasRoutes = require('./routes/citasRoutes');
const { obtenerHorariosDisponibles } = require('./controllers/horariosController');
const { generarHorarios } = require('./controllers/horariosController');
const doctoresRoutes = require('./routes/doctoresRoutes');
const administradoresRoutes = require('./routes/administradoresRoutes');

// Local
//const connectDB = require('./config/db');
// Atlas
const connectDB = require('./config/dbAtlas');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/pages'));

//Crear los usuarios
const run = require('./test/crearUsuario');

const iniciarUsuarios = async () => {
    try {
        await run();
        console.log('Usuarios verificados o creados correctamente.');
    } catch (error) {
        console.error('Error al crear usuarios:', error);
    }
};

iniciarUsuarios();

// 🧠 Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mediconnect_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2h
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect(`/${req.session.usuario.rol}`);
    }
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

app.get('/login', (req, res) => {
    if (req.session.usuario) {
        return res.redirect(`/${req.session.usuario.rol}`);
    }
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

//Citas y horarios
generarHorarios();
app.get('/horarios', obtenerHorariosDisponibles);

app.use((req, res, next) => {
    res.locals.request = req;
    next();
});

app.use('/', authRoutes);
app.use('/', sucursalesRoutes);
app.use('/', bitacoraRoutes);
app.use('/', citasRoutes);
app.use('/', doctoresRoutes);
app.use('/', administradoresRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
