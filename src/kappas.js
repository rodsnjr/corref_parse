var _ = require('lodash');
var correferencias = require('./correferencias');
var express = require('express');

var app = express.Router();

var gerarKappa = function(arquivo){
    var concordancia = correferencias
        .concordancia(arquivo);
    
    var _pares = concordancia.samplePares(30);
    var _kappa = correferencias.kappa(concordancia);
    return { kappa : _kappa, pares : _pares};
}

app.get('/correferencias/:arquivo', function(request, response){
    //response.render('kappa.njk', { kappas : saida });
    var template = gerarKappa(request.params.arquivo);
    response.render('kappa.njk', template);
});

module.exports = { router : app, kappaCorref : gerarKappa };