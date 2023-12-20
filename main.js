//express
const express = require('express');
const app = express();

//handlebars
const bodyParser = require('body-parser');
const {engine} = require('express-handlebars');
const handlebars = require('handlebars');

//routes
const indexRoutes = require('./routes/indexRoutes');
const filmeRoutes = require('./routes/filmeRoutes');
const developerRoutes = require('./routes/developerRoutes');

app.locals.DEVELOPER = true;
app.locals.FILME = true;

//handlebars & bodyParser
app.engine('handlebars', engine({defaultLayout: 'main', runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
}}));

handlebars.registerHelper('cmpModulo', (a, b, c) => {return a % b == c});

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/', indexRoutes);
app.use('/filme', filmeRoutes);

if(app.locals.DEVELOPER) app.use('/developer', developerRoutes);

app.use(function(err, req, res, next) {
	console.log(err);
	res.send(err);
});

app.use(function(req, res, next) {
	res.status(404).render('404');
});

app.listen(8181, (req,res) => console.log("rodando"));
