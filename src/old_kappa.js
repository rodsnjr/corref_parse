var _ = require('lodash');
var parser = require('./parser.js');
var express = require('express');

var app = express.Router();

var comparaCadeia = function (acadeia, bcadeias){
	
	var maior = 0;
	var current = 0;
	var _discord = 0;

	_.forEach(bcadeias, function(value){

		current = _.intersection(acadeia.content, value.content);
		
		if(current.length > maior){
			maior = current.length;
			_discord = bcadeias.length > value.length ? (bcadeias.length - maior) : (current.length - maior);	
		}
		
	});

	return { concord : maior, discord : _discord} ;
}

var comparaArquivos = function(cadeiasArquivo1, cadeiasArquivo2){

	var saida=[];

	_.forEach(cadeiasArquivo1, function(cadeia){
		saida.push(comparaCadeia(cadeia, cadeiasArquivo2));
	});

	return saida;

}

var _kappa = function(arquivo1, arquivo2, finish){
	parser.file(arquivo1, 'kappa', function(_cadeias){

		parser.file(arquivo2,'kappa', function(cadeias){
			finish(comparaArquivos(_cadeias, cadeias));
		});

	});

}

app.get('/correferencias', function(request, response){
	_kappa('./correferencias/Rodney/1.xml', './correferencias/Rodney/1_copy.xml', 
		function(saida){

			//console.log(saida);
			response.render('kappa.njk', { kappas : saida });

	});
	
});

module.exports = app;

