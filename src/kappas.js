var _ = require('lodash');
var correferencias = require('./correferencias');
var express = require('express');
var fs = require('fs');

var app = express.Router();

var gerarKappa = function(arquivo){
    var concordancia = correferencias
        .concordancia(arquivo);
    
    var _pares = concordancia.samplePares(10);
    var _kappa = correferencias.kappa(concordancia);
    var _divergentes = concordancia.getDivergentes();
    var _divergencias = concordancia.qtdDivergentes();
    return { concordancia : arquivo, kappa : _kappa, pares : _pares, divergentes : _divergentes, divergencias : _divergencias };
}

var gerarCSV = function(arquivo){
    var concordancia = correferencias
        .concordancia(arquivo);
    
    concordancia.gerarConcordancias();

    return concordancia.toParesString();
}

app.get('/correferencias/:arquivo', function(request, response){
    var template = gerarKappa(request.params.arquivo);
    response.render('./tabs/kappa.njk', template);
});

app.get('/correferencias/csv/:arquivo', function(request, response){
    var arquivo = gerarCSV(request.params.arquivo);

    fs.writeFileSync("./csv/" + request.params.arquivo + ".csv", arquivo); 

    response.download("./csv/" + request.params.arquivo + ".csv");
});


module.exports = { router : app, kappaCorref : gerarKappa };