const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sucursalesRoutes = require('./routes/sucursalesRoutes');

const app = express();

// 🔗 Conexión a la base de datos
connectDB();

// ⚙️ Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/pages'));



// 🧠 Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mediconnect_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));

// 🖼️ Archivos estáticos (CSS, imágenes, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Rutas GET para login y raíz
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

app.use((req, res, next) => {
    res.locals.request = req;
    next();
});

// 🔐 Rutas POST y protegidas
app.use('/', authRoutes);
app.use('/', sucursalesRoutes);

// 🚀 Iniciar el servidor
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
