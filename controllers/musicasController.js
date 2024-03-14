const Musica = require('../models/Musica');
const asyncHandler = require('express-async-handler');

exports.cadastroMusica = asyncHandler(async (req, res, next) => {  
    const {titulo, youtube, artista} = req.body;
    await Musica.create({
        titulo: titulo,
        youtube: youtube,
        artista: artista
    });
    res.redirect('/developer/musica/add');
});
