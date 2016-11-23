/*
    Importar 
    Estruturas de dados e Bibliotecas 

var FastSet = require("collections/fast-set");
*/
var _ = require('lodash');
var Set = require("collections/set");
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

    this.flatCadeias = function(){
        return _.flattenDeep(this.cadeias);
    }

    this.hasParEmCadeia = function(par){

    }
}

function Kappa(n, c){
    // soma de cada classe
    this.ci = 0;
    // consenso entre os anotadores para cada relação	
    // ex: S1=(1/(C*(C-1))) * (C1*(C1-1) + (C2*(C2-1))
    this.si = 0;
    // somatório de Si
    this.z = 0;
    // consenso total = Z/N
    this.pa = 0;
    // número total de anotações (N*C)
    this.nc = 0;
    // consendo esperado por chance de anotação
    // ((C1/NC)ˆ2) + ((C2/NC)ˆ2)
    this.pe = 0;
    // tamanho da amostra
    this.n = 0;
    // quantidade de anotadores
    this.c = 0;
    // coeficiente de consenso	Kappa=(P(A)-P(E))/(1-P(E))
    this.valor = 0;

    this.calcularKappa = function(concordancia){

    }
}

function Par(sintagma1, sintagma2){
    this.sintagma1 = sintagma1;
    this.sintagma2 = sintagma2;

    this.c1 = 0;
    this.c2 = 0;

    this.descricao = "";

    this.asArray = function(){
        return [sintagma1, sintagma2];
    }

    this.concordancia = function(arquivos){
        _.forEach(arquivos, function(arquivo){
            if (arquivo.hasParEmCadeia(this.asArray())){
                this.c1++;
            }else{
                this.c2++;
            }
        })
    }

    this.gerarDescricao = function(){
        this.descricao = "Par: (" +this.sintagma1 + " - " + this.sintagma2 + ")";
    }
}

Par.prototype.equals = function(o){
    // se tem SA-SB, nao pode ter SB-SA
    //Outro par exatamente igual
    var exactly = (this.sintagma1 == o.sintagma1) 
                &&  (this.sintagma2 == o.sintagma2); 
    // Casos de SB-SA, SA-SB
    var sides = (this.sintagma2 == o.sintagma1) &&
                (this.sintagma1 == o.sintagma2);
    return exactly || sides; 
};

function Concordancia(arquivos){
    this.arquivos = arquivos;
    this.sintagmasEmCadeias = new Set();
    this.pares = new Set();

    
    this.gerarSintagmasEmCadeias = function(){
        value = this.sintagmasEmCadeias;

        _.forEach(this.arquivos, function(arquivo){
            flat = arquivo.flatCadeias();
            value.addEach(flat);
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

    // Implementar, pegar uma lista com cada par, e o numero de concordancia
    this.gerarConcordancias = function(){
        _.forEach(this.pares, function(_par){
            _par.concordancia(this.arquivos);
        });
    }
    // Gera array com um pedaço dos pares pra desenhar na tela ...
    this.samplePares = function(size){
        saida = _.slice(this.pares.toArray(), 0, size);
        _.forEach(saida, function(par){
            par.gerarDescricao();
        });
        return saida;
    }

    this.tamanhoAmostra = function(){
        return this.sintagmasEmCadeias.length;
    }

    this.anotadores = function(){
        return this.arquivos.length;
    }

    this.gerarSintagmasEmCadeias();
    this.gerarPares();

}

/* 
    Ler de um diretório e sub diretórios, 
    os arquivos X e gerar um objeto de concordancia para todos
*/
var gerarConcordancias = function(nomeArquivo){
    var parametroBuscaDiretorio = { name : nomeArquivo, dados : "ids_cadeias" };
    var arquivos = [];

    /* Parsear o que veio do XML em um Objeto Arquivo */
    function gerarArquivo(xmlLido){
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

var gerarKappa = function(concordancia){
    kappa = new Kappa(concordancia.tamanhoAmostra, concordancia.anotadores);
    kappa.calcularKappa(concordancia);

    return kappa;
}

module.exports = { concordancia : gerarConcordancias, kappa : gerarKappa };