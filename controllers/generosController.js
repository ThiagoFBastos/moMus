const Genero = require('../models/Genero');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.cadastraGET = (req, res) => {
    res.render('genero/cadastro', {titulo: 'Cadastre um gênero'});
};

exports.cadastra = [
    body('nome', 'O nome não pode ser vazio').trim().notEmpty(),
    (req, res, next) => {
        let errors = validationResult(req);
        if(errors.isEmpty()) next();
        else {
            res.render('genero/cadastro', {
                titulo: 'Cadastre um gênero',
                errors: errors.array()
            });
        }
    },
    asyncHandler(async (req, res, next) => {
        await Genero.create({nome: req.body.nome});
        res.redirect('/developer/genero/add');
    })
];
