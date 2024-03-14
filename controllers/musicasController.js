const Musica = require('../models/Musica');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.cadastroMusicaGET = (req, res) => {
    res.render('musica/cadastro', {titulo: 'Cadastro de música'});
};

exports.cadastroMusica = [
    body('titulo', 'O título não pode ser vazio').trim().notEmpty(),
    body('youtube', 'O link deve ser uma url válida').trim().isURL(),
    body('artista', 'O artista não pode ser vazio').trim().notEmpty(),
    (req, res, next) => {
        let errors = validationResult(req);
        if(errors.isEmpty()) next();
        else {
            errors = errors.array();
            let msgs = {
                titulo: errors.filter(error => error.path == 'titulo'),
                youtube: errors.filter(error => error.path == 'youtube'),
                artista: errors.filter(error => error.path == 'artista')
            };
            res.render('musica/cadastro', {
                titulo: 'Cadastre uma música',
                errors: msgs
            });
        }
    },
    asyncHandler(async (req, res, next) => {
        const {titulo, youtube, artista} = req.body;
        await Musica.create({
            titulo: titulo,
            youtube: youtube,
            artista: artista
        });
        res.redirect('/developer/musica/add');
    })
];
