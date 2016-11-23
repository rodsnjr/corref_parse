/*
    Importar 
    Estruturas de dados e Bibliotecas 
*/
var _ = require('lodash');
var FastSet = require("collections/fast-set");
var parser = require('./parser');

/*

    Estruturas de dados 
---------------------------
Arquivo 
-Cadeias 
---------------------------
Correferencias (de todos os anotador/anotação por texto)
-Sintagmas em Cadeias
-Pares
---------------------------

*/
function Arquivo(cadeias){
    this.cadeias = cadeias;
}

function Par(sintagma1, sintagma2){
    this.sintagma1 = sintagma1;
    this.sintagma2 = sintagma2;
}

function Concordancia(arquivos){
    this.arquivos = arquivos;
    this.sintagmasEmCadeias = new Set();
    this.pares = new Set();

    
    this.gerarSintagmasEmCadeias = function(){
        value = this.sintagmasEmCadeias;
        _.forEach(this.arquivos, function(arquivo){
            value.addEach(arquivo.cadeias);
        });
    }

    this.gerarPares = function(){
        value = this.sintagmasEmCadeias;
        pares = this.pares;

        value.forEach(function(sintagma){
            value.forEach(function(sintagma1){
                if (sintagma != sintagma1)
                    pares.add(new Par(sintagma, sintagma1));
            });
        });
    }
    // Implementar, pega a concordancia de cada par
    this.getConcordancia = function(par){
        return { C1 : 0, C2 : 0};
    }
    // Implementar, pegar uma lista com cada par, e o numero de concordancia
    this.getConcordancias = function(){
        var concordancias = [];
        _.forEach(this.pares, function(_par){
            var concordancia = { par : _par};
            concordancia.push(getConcordancia(_par));
            concordancias.push(concordancia);
        });
    }

    this.gerarSintagmasEmCadeias();
    this.gerarPares();

}

/* 
    Ler de um diretório e sub diretórios, 
    os arquivos X e gerar um objeto de concordancia para todos
*/
var gerarConcordancias = function(nomeArquivo){
    var parametroBuscaDiretorio = { name : nomeArquivo, dados : "cadeia_ids_sintagmas" };
    var arquivos = [];

    /* Parsear o que veio do XML em um Objeto Arquivo */
    function gerarArquivo(xmlLido){
        console.log(xmlLido);
        return new Arquivo(xmlLido);
    }
    /* Gerar a lista de Arquivos lidos */
    parser.dir('./correferencias/', parametroBuscaDiretorio, function(arquivosLidos){
        _.forEach(arquivosLidos, function(arquivoLido){
            arquivos.push(gerarArquivo(arquivoLido));
        });
    });

    return new Concordancia(arquivos);
}

module.exports = { concordancia : gerarConcordancias };