const Genero = require('../models/Genero');
const asyncHandler = require('express-async-handler')

exports.cadastra = asyncHandler(async (req, res, next) => {
    let genero = {};
    genero.nome = req.body.nome.trim();
    await Genero.create(genero);
    res.redirect('/developer/genero/add');
});
