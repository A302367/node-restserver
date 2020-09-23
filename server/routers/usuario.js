const express = require('express');
const bcryptjs = require('bcryptjs');
// Se pone _ por standard de uso de esta libreria
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { findLastIndex } = require('underscore');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    // return res.json({
    //         usuario: req.usuario,
    //         nombre: req.usuario.nombre,
    //         email: req.usuario.email,
    //     })
    //res.json('Get Usuario');
    // en req.query caen los parametros
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });
        });
});
app.post('/usuario', [verificaToken, verificaAdminRol], (req, res) => {
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcryptjs.hashSync(body.password, 10),
            //password: body.password,
            //img: body.img
            role: body.role
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });

    })
    // buscar en la base de datos y actualizar registro
app.put("/usuario/:id", [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    // En el array para las propiedades que si se pueden modificar por put
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // PAso los campos que no quiero que se actualicen por put
    // con el pick esto no se necesita
    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            console.log("Errooorrr");
            return res.status(400).json({
                ok: false,
                err
            });
        }
        console.log("llego a la grabacion");
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;

    //  Eliminacion fisica
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         };
    //         if (!usuarioBorrado) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: "Usuario no encontrado"
    //                 }
    //             });
    //         }
    //         res.json({
    //             ok: true,
    //             usuario: usuarioBorrado
    //         });
    //     })
    // MArcado de borrado
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;