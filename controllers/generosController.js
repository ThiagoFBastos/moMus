const Genero = require('../models/Genero');

exports.cadastra = function(req, res) {
	let genero = {};
	genero.nome = req.body.nome.trim();
	Genero.create(genero);
	res.redirect('/developer/genero/add');
};
