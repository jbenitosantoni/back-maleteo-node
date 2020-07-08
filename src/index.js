const express = require('express');
const passport = require('passport');
const session = require('express-session')

// Requerimos el archivo de configuración de nuestra DB
require('./db.js');
require('./passport');

const userRoutes = require('./routes/users')

const PORT = 3001;
const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(express.static('public'));
server.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

server.use(
    session({
        secret: 'upgradehub_node', // ¡Este secreto tendremos que cambiarlo en producción!
        resave: false, // Solo guardará la sesión si hay cambios en ella.
        saveUninitialized: false, // Lo usaremos como false debido a que gestionamos nuestra sesión con Passport
        cookie: {
            maxAge: 3600000 // Milisegundos de duración de nuestra cookie, en este caso será una hora.
        },
    })
);
server.use(passport.initialize());
server.use(passport.session());

server.use('/user', userRoutes);

server.use(express.static('public'));

server.use('*', (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error); // Lanzamos la función next() con un error
});

server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
});

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
