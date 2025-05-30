const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const sucursalesRoutes = require('./routes/sucursalesRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
const citasRoutes = require('./routes/citasRoutes');
const citasV2Routes = require('./routes/citasV2Routes');
const doctoresRoutes = require('./routes/doctoresRoutes');
const medicamentosRoutes = require('./routes/medicamentosRoutes');
const recetasRoutes = require('./routes/recetasRoutes');
const administradoresRoutes = require('./routes/administradoresRoutes');
const especialidadesRoutes = require('./routes/especialidadesRoutes');
const historialRoutes = require('./routes/historialCitasRoutes');
const pacientesRoutes = require('./routes/pacientesRoutes');
const pagosRoutes = require('./routes/pagosRoutes');
const farmaceuticosRoutes = require('./routes/farmaceuticosRoutes');
const horariosNoDisponiblesRoutes = require('./routes/horariosNoDisponiblesRoutes');

// Local
//const connectDB = require('./config/db');
// Atlas
const connectDB = require('./config/dbAtlas');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/pages'));

//Middleware
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    res.locals.request = req;
    next();
});

app.use('/', authRoutes);
app.use('/', sucursalesRoutes);
app.use('/', bitacoraRoutes);
app.use('/', citasRoutes);
app.use('/', citasV2Routes);
app.use('/', doctoresRoutes);
app.use('/', administradoresRoutes);
app.use('/', especialidadesRoutes);
app.use('/', medicamentosRoutes);
app.use('/', recetasRoutes);
app.use('/', historialRoutes);
app.use('/', horariosNoDisponiblesRoutes);
app.use('/', pagosRoutes);
app.use('/', pacientesRoutes);
app.use('/', farmaceuticosRoutes)
app.use('/', horariosNoDisponiblesRoutes)

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
    console.log(`\n✅ \x1b[32m[ÉXITO]\x1b[0m Servidor iniciado correctamente`);
    console.log(`🌐 \x1b[36mURL:\x1b[0m \x1b[35mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`📡 \x1b[36mPuerto: \x1b[33m${PORT}\x1b[0m\n`);
});