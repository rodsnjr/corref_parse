var express = require('express');
var parser = require('./parser');

var fs = require('fs');
var _ = require('lodash');

var app = express.Router();

app.get('/correlacoes', function(request, response) {

    var _folders = [{ name : 'Rodney', files : [
      { name : '1.xls', url : '#' },  
      { name : '2.xls', url : '#' },
      { name : '3.xls', url : '#' }
    ]}];

    response.render('correlacoes.njk', { folders : _folders });
});

app.get('/correferencias', function(request,response){
    
    _folders = [];
    var pastas = fs.readdirSync('./correferencias');

    _.forEach(pastas, function(pasta){
        var _pasta = { name : pasta, files : [] };
        var arquivos = fs.readdirSync('./correferencias/' + pasta);

        _.forEach(arquivos, function(arquivo){
            var _url = '/arquivos/correferencias/' + pasta + '/' + arquivo;

            _pasta.files.push({ name : arquivo, url : _url });
        });

        _folders.push(_pasta);
    });

    response.render('correferencias.njk', { folders : _folders });

});

app.get('/correferencias/:folder/:file', function(request, response){

    var arquivo = './correferencias/' + request.params.folder + '/' + request.params.file;
    
    var xml = parser.file(arquivo, ['texto', 'cadeias', 'mencoes', 'sentencas'],
        function(value){
            var saida = { folder : request.params.folder , file : request.params.file };
            saida.sentencas = value.sentencas;
            saida.texto = value.texto;
            saida.cadeias = value.cadeias;
            saida.mencoes = value.mencoes;
            response.render('correferencia.njk', saida);
    });

});

module.exports = app;