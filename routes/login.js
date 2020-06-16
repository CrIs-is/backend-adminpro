var express = require('express');
var bycrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');
const { response } = require('./app');

app.post('/', (req, res) => {

    var body = req.body;


    Usuario.findOne({ email: body.email }, (err, findUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al Buscar usuario',
                errors: err
            })
        }

        if (!findUser) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        if (!bycrypt.compareSync(body.password, findUser.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            })
        }

        findUser.password = ':)'

        //CREAR TOKEN   
        var token = jwt.sign({ usuario: findUser }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            message: 'login works',
            user: findUser,
            token: token,
            id: findUser._id
        })
    });

})

module.exports = app;