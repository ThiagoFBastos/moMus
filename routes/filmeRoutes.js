const express = require('express');
const router = express.Router();
const FilmesController = require('../controllers/filmesController');
const Filme = require('../models/Filme');

router.param('filmeId', (req, res, next, id) => {
	Filme.findByPk(id).then(filme => {
		if(filme != null) {
			req.filme = filme;
			next();
		} else
			res.status(404).render('404');
	}).catch(err => {
		next(err);
	});
});

router.get('/', FilmesController.inicio);

router.get('/profile/:filmeId(\\d+)', FilmesController.exibe);

router.get('/short_search', FilmesController.pesquisaRapida);

router.get('/results/:page(\\d+)', FilmesController.pesquisa);

module.exports = router;
