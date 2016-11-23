var _ = require('lodash');
var correferencias = require('./correferencias');
var express = require('express');
var parser = require('./parser');

var app = express.Router();

function Kappa(correlacoes){
    // soma de cada classe
    var ci = 0;
    // consenso entre os anotadores para cada relação	
    // ex: S1=(1/(C*(C-1))) * (C1*(C1-1) + (C2*(C2-1))
    var si = 0;
    // somatório de Si
    var z = 0;
    // consenso total = Z/N
    var P_A = 0;
    // número total de anotações (N*C)
    var NC = 0;
    // consendo esperado por chance de anotação
    // ((C1/NC)ˆ2) + ((C2/NC)ˆ2)
    var P_E = 0;
    // tamanho da amostra
    var N = 0;
    // quantidade de anotadores
    var C = 0;
    // coeficiente de consenso	Kappa=(P(A)-P(E))/(1-P(E))
    var Kappa = 0;
}

app.get('/correferencias/:arquivo', function(request, response){
    //response.render('kappa.njk', { kappas : saida });

    var concordancias = correferencias
        .concordancia(request.params.arquivo);
    
    console.log(concordancias);

    response.send(concordancias);
});

module.exports = app;