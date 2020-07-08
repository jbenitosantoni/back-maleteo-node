const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const moment = require('moment');

const User = require('./models/User');

// Creamos los salts de bcrypt
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

                if (!req.body.email || !req.body.password || !req.body.surname || !req.body.name || !req.body.dateOfBirth || !req.body.marketing ) {
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