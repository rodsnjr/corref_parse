var express = require('express');
var parser = require('./parser');

var fs = require('fs');
var _ = require('lodash');

var read_dir = function(dir, exit_url){

    _folders = [];

    var pastas = fs.readdirSync(dir);

    _.forEach(pastas, function(pasta){
        var _pasta = { name : pasta, files : [] };
        if (fs.lstatSync(dir + pasta).isDirectory()){
            var arquivos = fs.readdirSync(dir + pasta);
            _.forEach(arquivos, function(arquivo){
                var _url = exit_url + pasta + '/' + arquivo;
                _pasta.files.push({ name : arquivo, url : _url });
            });
            _folders.push(_pasta);

        }else{
            _folders.files = _folders.files || []; 
            var _url = exit_url + pasta;
            _folders.files.push({ name : pasta, url : _url });
        }
        
    });

    return _folders;
}

var app = express.Router();

app.get('/correlacoes', function(request, response) {
    var _folders = read_dir('./correlacoes/', '/arquivos/correlacoes/');
    response.render('correlacoes.njk', { folders : _folders });
});

app.get('/correferencias', function(request,response){
    folders = read_dir('./correferencias/', '/arquivos/correferencias/');
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