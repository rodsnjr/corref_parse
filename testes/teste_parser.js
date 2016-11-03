var parser = require('../parser');

parser.file('./correferencias/H2-dftre765.txt.xml', 
      ['texto', 'cadeias', 'sentencas'], function(valores){
        console.log(valores);
});