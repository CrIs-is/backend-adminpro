var express = require('express');
var bycrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//GOOGLE
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;


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

});

//Autenticacion por google
app.post('/google', (req, res) => {

    var usertoken = req.body.token || 'XXX';
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);


    verify(usertoken, client, res).then((data) => {
        /*return res.status(200).json({
            ok: true,
            mensaje: 'El token es valido',
            data: data
        })*/
    }).catch((data) => {
        return res.status(500).json({
            ok: true,
            mensaje: 'El token no es valido',
            data: data
        })


    })

})

async function verify(usertoken, client, res) {
    const ticket = await client.verifyIdToken({
        idToken: usertoken,
        audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    Usuario.findOne({ email: payload.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar usuario',
                err: err
            });
        }

        //SI EL USUARIO EXISTE
        if (usuario) {

            //Si el usuario tiene un tipo de autenticacion diferente de google
            if (!usuario.google) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Utilize su autenticacion normal',
                })
            } else {
                usuario.password = ':)';
                //CREAR TOKEN   
                var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 })

                res.status(200).json({
                    ok: true,
                    user: usuario,
                    token: token,
                    id: usuario._id
                })
            }

        }
        //SI EL USUARIO NO EXISTE POR CORREO
        else {
            var usuario = new Usuario();

            usuario.name = payload.name;
            usuario.email = payload.email;
            usuario.password = ':)';
            usuario.img = payload.picture;
            usuario.google = true;


            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al crear usuario con google',
                        err: err
                    });
                }


                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

                res.status(200).json({
                    ok: true,
                    user: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                })

            })
        }



    });
}


module.exports = app;