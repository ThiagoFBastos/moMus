const Filme = require('../models/Filme');
const {Op} = require('sequelize');
const FilmeMusica = require('../models/FilmeMusica');
const Musica = require('../models/Musica');
const Genero = require('../models/Genero');
const FilmeGenero = require('../models/FilmeGenero');
const asyncHandler = require('express-async-handler');

exports.editaGET = (req, res) => {
	res.render('filme/editor', {
		titulo: 'Editar filme ' + req.filme.titulo,
		filme: req.filme
	});
};

exports.editaPOST = asyncHandler(async (req, res, next) => {
	let filmeId = req.params.filmeId, filme = req.filme;
    const {titulo, sinopse, ano, duracao, foto, bg_foto, direcao, roteiro, titulo_original} = req.body;
	filme.titulo = titulo;
	filme.sinopse = sinopse;
	filme.ano = ano;
	filme.duracao = duracao;
	filme.foto = foto;
	filme.bg_foto = bg_foto;
	filme.direcao = direcao;
	filme.roteiro = roteiro;
	filme.titulo_original = titulo_original;
	await filme.save();
	res.redirect('/filme/profile/' + filmeId);
});

exports.inicio = asyncHandler(async (req, res, next) => {
    const [carouselFilmes, filmesRecentes] = await Promise.all([
	    Filme.findAll({
		    attributes: ['id', 'titulo', 'bg_foto', 'createdAt'],
		    limit: 5,
		    order: [['createdAt', 'desc'], ['id', 'asc']],
		    include: [{
			    model: Genero,
			    required: true
		    }]}),
	   Filme.findAll({
		attributes: ['id', 'titulo', 'foto', 'updatedAt'],
		limit: 8,
		order: [['createdAt', 'desc'], ['id', 'ASC']]})
    ]);
	res.render('filme/inicio', {
		titulo: 'moMus: Filmes',
		carouselFilmes: carouselFilmes,
		filmesRecentes: filmesRecentes
	});
});

exports.pesquisaRapida = asyncHandler(async (req, res, next) => {
	let queryTitulo = req.query.titulo;
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
});

exports.pesquisa = asyncHandler(async (req, res, next) => {
	let queryTitulo = req.query.titulo ?? '', page = parseInt(req.params.page), queryParams = '?titulo=' + queryTitulo;
	const pagesOffset = 5;

	if(page == 0) {
		res.status(404).render('404');
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

	if(req.query.genero) {
		searchAttributes.include = [{
			model: Genero,
			required: true,
			attributes: [],
			where: {nome: req.query.genero}
		}];
		queryParams += '&genero=' + req.query.genero;
	}

	let cntResults = await Filme.count(searchAttributes);
    let total_pages = (cntResults + pagesOffset - 1) / pagesOffset | 0, delta;

	if(req.query.order_by_created) {
		let type = req.query.order_by_created;
		if(type in ['asc', 'desc']) {
			searchAttributes.order.push(['createdAt', type]);
			queryParams += '&order_by_created=' + type;
		}
	}

	searchAttributes.order.push(['id', 'asc']);
	searchAttributes.attributes = ['id', 'titulo', 'foto', 'sinopse', 'createdAt'];
	searchAttributes.offset = pagesOffset * (page - 1);
	searchAttributes.limit = pagesOffset;

	let filmes = (await Filme.findAll(searchAttributes)).map(filme => {
        filme.sinopse = filme.sinopse.substr(0, 500);
        return filme;
    });

	if(page > total_pages && !(page == 1 && total_pages == 0))  {
		res.status(404).render('404');
		return;
	}

    if(total_pages < 5 || page <= 2) delta = page - 1;
    else if(page - 2 >= 1 && page + 2 <= total_pages) delta = 2;
    else if(page - 3 >= 1 && page + 1 <= total_pages) delta = 3;
    else delta = 4;

    let pages = [];
    for(let i = 0; i < 5 && page - delta + i <= total_pages; ++i) {
        let curPage = page - delta + i;
        pages.push({
            url: `/filme/results/${curPage}${queryParams}`,
            text: curPage,
            is_cur_page: curPage == page
        });
    }

	res.render('filme/resultados', {
		cnt_resultados: cntResults,
		shows: filmes,
		previousPage: page > 1 ? "/filme/results/" + (page - 1) + queryParams : false,
		nextPage: page < total_pages ? "/filme/results/" + (page + 1) + queryParams : false,
		pages: pages,
		titulo: 'Resultados de "' + queryTitulo + '"',	
		queryTitulo: queryTitulo
	});
});

exports.cadastraGET = (req, res) => {
	res.render('filme/cadastro', {titulo: 'moMus: cadastro de filme'})
};

exports.cadastraPOST = asyncHandler(async (req, res, next) => {
    const {titulo, sinopse, ano, duracao, foto, bg_foto, direcao, roteiro, titulo_original} = req.body;
    await Filme.create({
        titulo: titulo,
        sinopse: sinopse,
        ano: ano,
        duracao: duracao,
        foto: foto,
        bg_foto: bg_foto,
        direcao: direcao,
        roteiro: roteiro,
        titulo_original: titulo_original
    });
	res.redirect('/developer/filme/add');
});

exports.exibe = asyncHandler(async (req, res, next) => {
	let filme = req.filme;
    const [musicas, generos] = await Promise.all([
	    filme.getMusicas({
		    attributes: ['id','titulo','artista','youtube'],
		    order: [['titulo', 'ASC']]
	    }),
	    filme.getGeneros({
		    attributes: ['nome'],
		    order: [['nome', 'asc']]
	    })
    ]);
	res.render('filme/perfil', {
		filme: filme, 
		musicas: musicas,
		generos: generos,
		titulo: filme.titulo
	});
});

exports.relacionaMusicaGET = asyncHandler(async (req, res, next) => {
	let musicas = await Musica.findAll({
		attributes: ['id', 'titulo', 'artista'],
		order: [['createdAt', 'DESC']]
	});
	res.render('filme/adiciona_musica', {
		id: req.params.filmeId, 
		musicas: musicas,		
		titulo:  'Adicionar trilha sonóra a ' + req.filme.titulo
	});
});

exports.relacionaMusicaPOST = asyncHandler(async (req, res, next) => {
	let filme = req.filme, musicaId = req.body.musica;
	let musica = await Musica.findByPk(musicaId);
	if(musica == null) throw new Error('musica(' + musicaId + ') não encontrado');
	filme.addMusica(musica);
	res.redirect('/developer/filme/' + req.params.filmeId + '/join/music');	
});

exports.desvinculaMusicaGET = asyncHandler(async (req, res, next) => {
	let filme = req.filme;
	let musicas = await filme.getMusicas();
	res.render('filme/remove_musica', {
		id: req.params.filmeId,
		musicas: musicas,
		titulo: 'Desvincular música de ' + filme.titulo
	});
});

exports.desvinculaMusicaPOST = asyncHandler(async (req, res, next) => {
	let filme = req.filme, musicaId = req.body.musica;
	let musica = await Musica.findByPk(musicaId);
	if(musica == null) throw new Error('musica(' + musicaId + ') não encontrado');
	await filme.removeMusica(musica);
	res.redirect('/developer/filme/' + req.params.filmeId + '/disjoin/music');
});

exports.relacionaGeneroGET = asyncHandler(async (req, res, next) => {
	let filmeId = req.params.filmeId, filme = req.filme;
	let generos = await Genero.findAll({attributes: ['id', 'nome']});
	res.render('filme/adiciona_genero', {
		id: filmeId,
		generos: generos,
		titulo: 'Adicionar gênero a ' + req.filme.titulo
	});
});

exports.relacionaGeneroPOST = asyncHandler(async (req, res, next) => {
	let filmeId = req.params.filmeId, filme = req.filme, idGenero = req.body.genero;
	let genero = await Genero.findByPk(idGenero);
	if(genero == null) throw new Error('genero(' + generoId + ') não encontrado');
	filme.addGenero(genero);
	res.redirect('/developer/filme/' + filmeId + "/join/gender");
});

exports.desvinculaGeneroGET = asyncHandler(async (req, res, next) => {
	let filme = req.filme;
	let generos = await filme.getGeneros();
	res.render('filme/remove_genero', {
		id: req.params.filmeId,
		generos: generos,
		titulo: 'Desvincular gênero de ' + req.filme.titulo
	});
});

exports.desvinculaGeneroPOST = asyncHandler(async (req, res, next) => {
	let filme = req.filme, generoId = req.body.genero;
	let genero = await Genero.findByPk(generoId);
	if(genero == null) throw new Error('genero(' + generoId + ') não encontrado');
	await filme.removeGenero(genero);
	res.redirect('/developer/filme/' + req.params.filmeId + '/disjoin/gender');
});

exports.deletaFilme = asyncHandler(async (req, res, next) => {
    let filme = req.filme;
    await filme.destroy();
    res.redirect('/filme');
});
