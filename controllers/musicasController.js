const {Op} = require('sequelize');
const Musica = require('../models/Musica');

exports.cadastroMusica = function(req, res) {
	let musica = {};
	musica.titulo = req.body.titulo.trim();
	musica.youtube = req.body.youtube.trim();
	musica.artista = req.body.artista.trim();
	Musica.create(musica);
	res.redirect('/developer/musica/add');
};
