const express = require('express');
let { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');

//==================================
// Mostrar todas las categorias
//==================================
app.get('/categoria', verificaToken, (req, res) => {
    // let desde = req.query.desde || 0;
    // desde = Number(desde);
    // let limite = req.query.limite || 5;
    // limite = Number(limite);
    Categoria.find({})
        .sort('descripcion')
        // El populate trae los datos de la colleccion usuario, segundo parametro campos a visualizar
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });

            });
        });
});
//==================================
// Mostrar una categoria por ID
//==================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.finById (...Categoria..);
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "El ID no es correcto"
                }
            });
        }
        // .skip(desde)
        // .limit(limite)

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
//==================================
// Crear Nueva Categoria
//==================================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa nueva categoria
    // req.usuario.id
    let body = req.body;
    console.log("Error aca ??  1");
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    console.log("Pasoooo  2");
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});
//==================================
// Actualiza categoria nombre de lacategoria
//==================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});
//==================================
// borra la categoria
//==================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    // solo administrador borra categoria
    // Eliminar no marcar
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            });
        }

        res.json({
            ok: true,
            message: "Categoria Borrada"
        });
    });

});

module.exports = app;