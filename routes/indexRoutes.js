const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('inicio', {titulo: 'moMus'}));

router.get('/developer', (req, res) => res.render('developer/main', {titulo: 'moMus'}));

module.exports = router;
