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
    var pastas = fs.readdirSync('./correlacoes');

    _.forEach(pastas, function(pasta){
        var _pasta = { name : pasta, files : [] };
        var arquivos = fs.readdirSync('./correlacoes' + pasta);

        _.forEach(arquivos, function(arquivo){
            var _url = '/arquivo/correferencias/' 
                + pasta + '/' + arquivo;

            _pasta.files.push({ name : arquivo, url : _url });
        });

        exit.push(_pasta);
    });

    response.render('correferencias.njk', { folders : _folders });

});

app.get('/correferencias/:pasta/:arquivo', function(request, response){
    var arquivo = './correferencias/' + 
        req.pasta + '/' + req.arquivo;

    var xml = parser.file(arquivo, ['texto', 'cadeias', 'sentencas'],
        function(value){
            response.render('correferencia.njk', valores);
    });

});

module.exports = app;