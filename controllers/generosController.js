const Genero = require('../models/Genero');
const asyncHandler = require('express-async-handler');

exports.cadastra = asyncHandler(async (req, res, next) => {
    await Genero.create({nome: req.body.nome});
    res.redirect('/developer/genero/add');
});
