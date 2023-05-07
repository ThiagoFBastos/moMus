curDir = '/controllers';
dirname = __dirname.substring(0, __dirname.length - curDir.length);

const Genero = require(dirname + '/models/Genero');

exports.cadastra = function(req, res) {
	let genero = {};

	genero.nome = req.body.nome.trim();

	Genero.create(genero);

	res.redirect('/developer/genero/add');
};
