const express = require('express');
const router = express.Router();
const FilmesController = require('../controllers/filmesController');
const MusicasController = require('../controllers/musicasController');
const GenerosController = require('../controllers/generosController');
const Filme = require('../models/Filme');

//filmes

router.param('filmeId', (req, res, next, id) => {
	Filme.findByPk(id).then(filme => {
		if(filme != null) {
			req.filme = filme;
			next();
		} else 
            res.status(404).render('404');
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

router.get('/filme/:filmeId(\\d+)/delete', FilmesController.deletaFilme);

//música
router.route('/musica/add')
    .get(MusicasController.cadastroMusicaGET)
    .post(MusicasController.cadastroMusica);

//gêneros
router.route('/genero/add')
    .get(GenerosController.cadastraGET)
    .post(GenerosController.cadastra);

module.exports = router;
