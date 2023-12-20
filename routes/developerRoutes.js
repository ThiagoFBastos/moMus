const express = require('express');
const router = express.Router();
const FilmesController = require('../controllers/filmesController');
const MusicasController = require('../controllers/musicasController');
const GenerosController = require('../controllers/generosController');

//filmes

const Filme = require('../models/Filme');

router.param('filmeId', function(req, res, next, id) {
	Filme.findByPk(id).then(filme => {
		if(filme != null) {
			req.filme = filme;
			next();
		} else res.render('404');
	}).catch(err => next(err));
});

router.route('/filme/add')
	.get(FilmesController.cadastraGET)
	.post(FilmesController.cadastraPOST);

router.route('/filme/:filmeId(\\d+)/join/music')
	.get(FilmesController.relacionaMusicaGET)
	.post(FilmesController.relacionaMusicaPOST);

router.route('/filme/:filmeId(\\d+)/disjoin/music')
	.get(FilmesController.desvinculaMusicaGET)
	.post(FilmesController.desvinculaMusicaPOST);

router.route('/filme/:filmeId(\\d+)/join/gender')
	.get(FilmesController.relacionaGeneroGET)
	.post(FilmesController.relacionaGeneroPOST);

router.route('/filme/:filmeId(\\d+)/disjoin/gender')
	.get(FilmesController.desvinculaGeneroGET)
	.post(FilmesController.desvinculaGeneroPOST);

router.route('/filme/:filmeId(\\d+)/edit')
	.get(FilmesController.editaGET)
	.post(FilmesController.editaPOST);

//música
router.get('/musica/add', (req, res) => res.render('musica/cadastro', {titulo: 'moMus'}));
router.post('/musica/register', MusicasController.cadastroMusica);

//gêneros
router.get('/genero/add', (req, res) => res.render('genero/cadastro', {titulo: 'moMus'}));
router.post('/genero/register', GenerosController.cadastra);

module.exports = router;
