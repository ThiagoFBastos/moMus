const Filme = require('../models/Filme');
const {Op} = require('sequelize');
const FilmeMusica = require('../models/FilmeMusica');
const Musica = require('../models/Musica');
const Genero = require('../models/Genero');
const FilmeGenero = require('../models/FilmeGenero');

exports.editaGET = async function(req, res, next) {
	res.render('filme/editor', {
		titulo: 'Editar filme ' + req.filme.titulo,
		filme: req.filme
	});	
};

exports.editaPOST = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		filme.titulo = req.body.titulo.trim();
		filme.sinopse = req.body.sinopse.trim();
		filme.ano = parseInt(req.body.ano);
		filme.duracao = parseInt(req.body.duracao);
		filme.foto = req.body.foto.trim();
		filme.bg_foto = req.body.bg_foto.trim();
		filme.direcao = req.body.direcao.trim();
		filme.roteiro = req.body.roteiro.trim();
		filme.titulo_original = req.body.titulo_original.trim();
		await filme.save();
		res.redirect('/filme/profile/' + filmeId);
	} catch(err) {
		next(err);
	}
};

exports.inicio = async function(req, res, next) {
	try {
		let carouselFilmes = await Filme.findAll({
			attributes: ['id', 'titulo', 'bg_foto', 'createdAt'],
			limit: 5,
			order: [['createdAt', 'desc'], ['id', 'asc']],
			include: [{
				model: Genero,
				required: true
			}]
		});
		let filmesRecentes = await Filme.findAll({
			attributes: ['id', 'titulo', 'foto', 'updatedAt'],
			limit: 8,
			order: [['createdAt', 'desc'], ['id', 'ASC']]
		});
		res.render('filme/inicio', {
			titulo: 'moMus: Filmes',
			carouselFilmes: carouselFilmes,
			filmesRecentes: filmesRecentes
		});
	} catch(err) {
		next(err);
	}
};

exports.pesquisaRapida = async function(req, res, next) {
	try {
		let queryTitulo = req.query.titulo.trim();
		let filmes = await Filme.findAll({
			attributes: ['id', 'titulo', 'foto'],
			where: {
				[Op.or]: {
					titulo: {[Op.startsWith]: queryTitulo},	
					titulo_original: {[Op.startsWith]: queryTitulo}
				}
			},
			limit: 5
		});
		res.json({filmes: filmes});
	} catch(err) {
		next(err);
	}
};

exports.pesquisa = async function(req, res, next) {
	try {
		let queryTitulo = req.query.titulo != undefined ? req.query.titulo.trim() : '';
		let page = parseInt(req.params.page);
		let get_params = '?titulo=' + queryTitulo;
		const pagesOffset = 5;

		if(page == 0) {
			res.render('404');
			return;
		}

		let searchAttributes = {
			where: {
				[Op.or]: {
					titulo: {[Op.startsWith]: queryTitulo},
					titulo_original: {[Op.startsWith]: queryTitulo}
				}
			},
			order: []
		};

		if(req.query.genero != undefined) {
			searchAttributes.include = [{
				model: Genero,
				required: true,
				attributes: [],
				where: {nome: req.query.genero}
			}];
			get_params += '&genero=' + req.query.genero;
		}

		let cnt = await Filme.count(searchAttributes);

		if(req.query.order_by_created != undefined) {
			let type = req.query.order_by_created;
			if(type == 'asc' || type == 'desc') {
				searchAttributes.order.push(['createdAt', type]);
				get_params += '&order_by_created=' + type;
			}
		}

		searchAttributes.order.push(['id', 'asc']);

		searchAttributes.attributes = ['id', 'titulo', 'foto', 'sinopse', 'createdAt'];
		searchAttributes.offset = pagesOffset * (page - 1);
		searchAttributes.limit = pagesOffset;

		let filmes = await Filme.findAll(searchAttributes);

		let pages = [];

		for(let i = 0; i < filmes.length; ++i)
			filmes[i].sinopse = filmes[i].sinopse.substring(0, 500);

		let total_pages = (cnt + pagesOffset - 1) / pagesOffset | 0;

		if(page > total_pages && !(page == 1 && total_pages == 0))  {
			res.render('404');
			return;
		}

		if(total_pages <= pagesOffset) {
			for(let i = 1; i <= total_pages; ++i) {
				let url = '/filme/results/' + i + get_params;
				pages.push({url: url, text: i, is_cur_page: i == page});
			}
		} else if(page >= 3 && page + 2 <= total_pages) {
			for(let i = 0; i < pagesOffset; ++i) {
				let p = page - (pagesOffset >> 1)  + i;
				let url = '/filme/results/' + p + get_params;
				pages.push({url: url, text: p, is_cur_page: p == page});
			}
		} else if(page + 2 <= total_pages) {
			for(let i = 1; i <= pagesOffset; ++i) {
				let url = '/filme/results/' + i + get_params;
				pages.push({url: url, text: i, is_cur_page: i == page});
			}
		} else {
			for(let i = total_pages - pagesOffset + 1; i <= total_pages; ++i) {
				let url = '/filme/results/' + i + get_params;
				pages.push({url: url, text: i, is_cur_page: i == page});
			}
		}
		
		let previousPage = page > 1 ? "/filme/results/" + (page - 1) + get_params : false;
		let nextPage = page < total_pages ? "/filme/results/" + (page + 1) + get_params : false;

		res.render('filme/resultados', {
			cnt_resultados: cnt,
			shows: filmes,
			previousPage: previousPage,
			nextPage: nextPage,
			pages: pages,
			titulo: 'Resultados de "' + queryTitulo + '"',	
			queryTitulo: queryTitulo
		});
	} catch(err) {
		next(err);
	}
};

exports.cadastraGET = function(req, res) {
	res.render('filme/cadastro', {titulo: 'moMus: cadastro de filme'})
};

exports.cadastraPOST = function(req, res, next) {
	try {
		let filme = {};
		filme.titulo = req.body.titulo.trim();
		filme.sinopse = req.body.sinopse.trim();
		filme.ano = parseInt(req.body.ano);
		filme.duracao = parseInt(req.body.duracao);
		filme.foto = req.body.foto.trim();
		filme.bg_foto = req.body.bg_foto.trim();
		filme.direcao = req.body.direcao.trim();
		filme.roteiro = req.body.roteiro.trim();
		filme.titulo_original = req.body.titulo_original.trim();
		Filme.create(filme);
		res.redirect('/developer/filme/add');
	} catch(err) {
		next(err);
	}
};

exports.exibe = async function(req, res, next) {
	try {
		let filme = req.filme;
		let musicas = await filme.getMusicas({
			attributes: ['id','titulo','artista','youtube'],
			order: [['titulo', 'ASC']]
		});
		let generos = await filme.getGeneros({
			attributes: ['nome'],
			order: [['nome', 'asc']]
		});
		res.render('filme/perfil', {
			filme: filme, 
			musicas: musicas,
			generos: generos,
			titulo: filme.titulo
		});
	} catch(err) {
		next(err);
	}
};

exports.relacionaMusicaGET = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId);
		let musicas = await Musica.findAll({
			attributes: ['id', 'titulo', 'artista'],
			order: [['createdAt', 'DESC']]
		});
		res.render('filme/adiciona_musica', {
			id: filmeId, 
			musicas: musicas,		
			titulo:  'Adicionar trilha sonóra a ' + req.filme.titulo
		});
	} catch(err) {
		next(err);
	}
};

exports.relacionaMusicaPOST = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		let musicaId = parseInt(req.body.musica);
		let musica = await Musica.findByPk(musicaId);
		if(musica == null) throw new Error('musica(' + musicaId + ') não encontrado');
		filme.addMusica(musica);
		res.redirect('/developer/filme/' + filmeId + '/join/music');	
	} catch(err) {
		next(err);
	}
};

exports.desvinculaMusicaGET = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		let musicas = await filme.getMusicas();
		res.render('filme/remove_musica', {
			id: filmeId,
			musicas: musicas,
			titulo: 'Desvincular música de ' + req.filme.titulo
		});
	} catch(err) {
		next(err);
	}
};

exports.desvinculaMusicaPOST = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		let musicaId = parseInt(req.body.musica);
		let musica = await Musica.findByPk(musicaId);
		if(musica == null) throw new Error('musica(' + musicaId + ') não encontrado');
		await filme.removeMusica(musica);
		res.redirect('/developer/filme/' + filmeId + '/disjoin/music');
	} catch(err) {
		next(err);
	}
};

exports.relacionaGeneroGET = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		let generos = await Genero.findAll({attributes: ['id', 'nome']});
		res.render('filme/adiciona_genero', {
			id: filmeId,
			generos: generos,
			titulo: 'Adicionar gênero a ' + req.filme.titulo
		});
	} catch(err) {
		next(err);
	}
};

exports.relacionaGeneroPOST = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		let idGenero = parseInt(req.body.genero);
		let genero = await Genero.findByPk(idGenero);
		if(genero == null) throw new Error('genero(' + generoId + ') não encontrado');
		filme.addGenero(genero);
		res.redirect('/developer/filme/' + filmeId + "/join/gender");
	} catch(err) {
		next(err);
	}
};

exports.desvinculaGeneroGET = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		let generos = await filme.getGeneros();
		res.render('filme/remove_genero', {
			id: filmeId,
			generos: generos,
			titulo: 'Desvincular gênero de ' + req.filme.titulo
		});
	} catch(err) {
		next(err);
	}
};

exports.desvinculaGeneroPOST = async function(req, res, next) {
	try {
		let filmeId = parseInt(req.params.filmeId), filme = req.filme;
		let generoId = parseInt(req.body.genero);
		let genero = await Genero.findByPk(generoId);
		if(genero == null) throw new Error('genero(' + generoId + ') não encontrado');
		await filme.removeGenero(genero);
		res.redirect('/developer/filme/' + filmeId + '/disjoin/gender');
	} catch(err) {
		next(err);
	}	
};
