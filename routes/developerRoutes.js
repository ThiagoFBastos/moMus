curDir = '/routes';
dirname = __dirname.substring(0, __dirname.length - curDir.length);

const express = require('express');
const router = express.Router();
const FilmesController = require(dirname + '/controllers/filmesController');
//const AnimesController = require(dirname + '/controllers/animesController');
//const SeriesController = require(dirname + '/controllers/seriesController');
//const NovelasController = require(dirname + '/controllers/novelasController');
const MusicasController = require(dirname + '/controllers/musicasController');
const GenerosController = require(dirname + '/controllers/generosController');

//filmes

const Filme = require(dirname + '/models/Filme');

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

//series
/*
router.get('/serie/add', (req, res) => res.render('serie/cadastro', {titulo: 'moMus'}));
router.post('/serie/register', SeriesController.cadastra);
router.get('/serie/joinMusic/:id(\\d+)', SeriesController.relacionaMusica);
router.post('/serie/joinMusic/:id(\\d+)/bind', SeriesController.adicionaMusica);
*/

//animes
/*
router.get('/anime/add', (req, res) => res.render('anime/cadastro', {titulo: 'moMus'}));
router.post('/anime/register', AnimesController.cadastra);
router.get('/anime/:id(\\d+)/season/add', (req, res) => res.render('anime/registrar_temporada', {id: req.params.id, titulo: 'moMus'}));
router.post('/anime/:id(\\d+)/season/cadastraTemporada', AnimesController.cadastraTemporada);
router.get('/anime/joinMusic/:id(\\d+)', AnimesController.relacionaMusica);
router.post('/anime/joinMusic/:id(\\d+)/bind', AnimesController.adicionaMusica);
*/

//novela
/*
router.get('/novela/add', (req, res) => res.render('novela/cadastro', {titulo: 'moMus'}));
router.post('/novela/register', NovelasController.cadastra);
router.get('/novela/joinMusic/:id(\\d+)', NovelasController.relacionaMusica);
router.post('/novela/joinMusic/:id(\\d+)/bind', NovelasController.adicionaMusica);
*/

//música
router.get('/musica/add', (req, res) => res.render('musica/cadastro', {titulo: 'moMus'}));
router.post('/musica/register', MusicasController.cadastroMusica);

//gêneros
router.get('/genero/add', (req, res) => res.render('genero/cadastro', {titulo: 'moMus'}));
router.post('/genero/register', GenerosController.cadastra);

module.exports = router;
