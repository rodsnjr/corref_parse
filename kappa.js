var _ = require('lodash');
var parser = require('./parser.js');


var comparaCadeia = function (acadeia, bcadeias){
	
	var maior = 0;
	var current = 0;

	_.forEach(bcadeias, function(value){

		current = _.intersection(acadeia.content, value.content);
			
		if(current.length > maior){
			maior = current.length;
		}
		
	});

	return maior;
}

var comparaArquivos = function(cadeiasArquivo1, cadeiasArquivo2){

	var saida=[];

	_.forEach(cadeiasArquivo1, function(cadeia){
		saida.push(comparaCadeia(cadeia, cadeiasArquivo2));
	});

	return saida;

}

parser.file('1.xml', 'cadeias', function(_cadeias){
	parser.file('2.xml','cadeias', function(cadeias){
		console.log(comparaArquivos(_cadeias, cadeias));
	});
});
