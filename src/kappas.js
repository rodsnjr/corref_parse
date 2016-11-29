var _ = require('lodash');
var correferencias = require('./correferencias');
var express = require('express');

var app = express.Router();

var gerarKappa = function(arquivo){
    var concordancia = correferencias
        .concordancia(arquivo);
    
    var _pares = concordancia.samplePares(10);
    var _kappa = correferencias.kappa(concordancia);
    return { concordancia : arquivo, kappa : _kappa, pares : _pares};
}

var gerarCSV = function(arquivo){
    var concordancia = correferencias
        .concordancia(arquivo);
    return concordancia.toParesString();
}

app.get('/correferencias/:arquivo', function(request, response){
    var template = gerarKappa(request.params.arquivo);
    response.render('./tabs/kappa.njk', template);
});

app.get('/correferencias/:arquivo/csv', function(request, response){
    var arquivo = gerarCSV(request.params.arquivo);
    response.send(arquivo);
    //response.render('./tabs/kappa.njk', template);
});


module.exports = { router : app, kappaCorref : gerarKappa };