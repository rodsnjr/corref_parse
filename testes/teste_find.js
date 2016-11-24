var _ = require('lodash');
//var linq = require("linq");

// As cadeias que estão no Arquivo 1, por exemplo.
var cadeias = [[12, 22, 33], [15,14,32]]

// Um exemplo de Par
var par = [12,33];

// Sabemos que esse par está em uma mesma cadeia, então C1 deve ser somado
// Colocar aqui o código para verificar essa ocorrência:
// Facilitadores dessa busca: 
// https://lodash.com/docs/
// http://neue.cc/reference.htm

//console.log(cadeias.indexOf(par));
var found = _.some(cadeias, function(arrays){
    return _.includes(arrays, par[0]) && _.includes(arrays, par[1]);
});

console.log(found);