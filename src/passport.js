const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('./models/User');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const saltRounds = 10;

passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            nameField: 'name',
            surnameField: 'surname',
            dateOfBirthField: 'dateOfBirth',
            marketingField: 'marketing',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                // Primero buscamos si el usuario existe en nuestra DB
                const previousUser = await User.findOne({email: email});

                if (!req.body.email || !req.body.password || !req.body.surname || !req.body.name || !req.body.dateOfBirth) {
                    const error = new Error('Some input is missing!');
                    return done(error);
                }

                // Check if already registered
                if (previousUser) {
                    const error = new Error('The user is already registered!');
                    return done(error);
                }

                // Password Length
                if (password.length < 8) {
                    const error = new Error('Password should have at least 9 characters');
                    return done(error);
                }

                // Age check
                if ((moment().diff(req.body.dateOfBirth, 'years',true)) <= 18) {
                    const error = new Error('User must be over 18 years old!');
                    return done(error);
                }

                const hash = await bcrypt.hash(password, saltRounds);

                // Creamos el nuevo user y lo guardamos en la DB
                const newUser = new User({
                    email: email,
                    password: hash,
                    name: req.body.name,
                    surname: req.body.surname,
                    dateOfBirth: req.body.dateOfBirth,
                    marketing: req.body.marketing,
                });

                const savedUser = await newUser.save();
                // Invocamos el callback con null donde iría el error y el usuario creado
                done(null, savedUser);
            } catch (err) {
                // Si hay un error, resolvemos el callback con el error
                return done(err);
            }
        }
    )
);

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                // Primero buscamos si el usuario existe en nuestra DB
                const currentUser = await User.findOne({email: email});

                // Si NO existe el usuario, tendremos un error...
                if (!currentUser) {
                    const error = new Error('The user does not exist!');
                    return done(error);
                }

                // // Si existe el usuario, vamos a comprobar si su password enviado coincide con el registrado
                const isValidPassword = await bcrypt.compare(
                    password,
                    currentUser.password
                );

                // Si el password no es correcto, enviamos un error a nuestro usuario
                if (!isValidPassword) {
                    const error = new Error(
                        'The email & password combination is incorrect!'
                    );
                    return done(error);
                }

                // Si todo se valida correctamente, completamos el callback con el usuario
                done(null, currentUser);
            } catch (err) {
                // Si hay un error, resolvemos el callback con el error
                return done(err);
            }
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            consumerKey: "1035066563057-trse1tc7j5be55347cnrp0uu7gnppje6.apps.googleusercontent.com",
            consumerSecret: "dSR9bcbMYt5lEsYBjw9D88NY",
            callbackURL: "/auth/google/redirect"
        },
        accessToken => {
            console.log("access token: ", accessToken);
        }
    )
);

