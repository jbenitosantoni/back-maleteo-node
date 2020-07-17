const express = require('express');
const passport = require('passport');
const cors = require('cors');

require('./db.js');
require('./passport');
require('./auth/auth');

const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const lockerRoutes = require('./routes/locker');

const PORT = 3001;
const server = express();

server.use(cors({origin: '*'}));

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(express.static('public'));
server.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
server.use(passport.initialize());
server.use('/user', passport.authenticate('jwt', { session : false }), userRoutes );
server.use('/locker', passport.authenticate('jwt', { session : false }), lockerRoutes );
server.use('/login', loginRoutes);
server.use('/register', registerRoutes);
server.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

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
