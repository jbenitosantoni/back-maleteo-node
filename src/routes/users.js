const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

const saltRounds = 10;

router.put('/', async (req, res, next) => {
    if (req.user) {
        console.log(req.user);
        try {
            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;
            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            if (req.body.email) {
                user.email = req.body.email;
            }

            if (req.body.password && req.body.newPassword) {
                const isValidPassword = await bcrypt.compare(
                    req.body.oldPassword,
                    user.password
                );
                if(isValidPassword) {
                    user.password = req.body.newPassword;
                } else {
                    const error = "Your current password is not correct";
                    return res.status(401).send(error);
                }
            }

            if (req.body.name) {
                const error = "You cant change your name";
                return res.status(422).send(error);
            }

            if (req.body.surname) {
                const error = "You cant change your surname";
                return res.status(422).send(error);
            }
            if (req.body.dateOfBirth) {
                const error = "You cant change your date of birth";
                return res.status(422).send(error);
            }
            if (req.body.marketing) {
                if (!(typeof req.body.marketing === "boolean")){
                    const error = "You must send a boolean for marketing";
                    return res.status(422).send(error);
                }
                user.marketing = req.body.marketing;
            }

            if (req.body.profileDescription) {
                user.profileDescription = req.body.profileDescription;
            }

            if (req.body.profileImage) {
                user.profileImage = req.body.profileImage;
            }

            if (req.body.profileImage) {
                user.profileImage = req.body.profileImage;
            }

            const updatedUser = await User.findByIdAndUpdate(
                id, // La id para encontrar el documento a actualizar
                user, // Campos que actualizaremos
                {new: true} // Usando esta opción, conseguiremos el documento actualizado cuando se complete el update
            );
            return res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }
});

module.exports = router;
