const Musica = require('../models/Musica');
const asyncHandler = require('express-async-handler');

exports.cadastroMusica = asyncHandler(async (req, res, next) => {
    let musica = {};
    musica.titulo = req.body.titulo.trim();
    musica.youtube = req.body.youtube.trim();
    musica.artista = req.body.artista.trim();
    await Musica.create(musica);
    res.redirect('/developer/musica/add');
});
