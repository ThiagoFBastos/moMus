curDir = '/controllers';
dirname = __dirname.substring(0, __dirname.length - curDir.length);

const {Op} = require('sequelize');
const Musica = require(dirname + '/models/Musica');

exports.cadastroMusica = function(req, res) {
	let musica = {};
	musica.titulo = req.body.titulo.trim();
	musica.youtube = req.body.youtube.trim();
	musica.artista = req.body.artista.trim();
	Musica.create(musica);
	res.redirect('/developer/musica/add');
};
