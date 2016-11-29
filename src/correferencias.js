/*
    Importar 
    Estruturas de dados e Bibliotecas 

var FastSet = require("collections/fast-set");
*/
var _ = require('lodash');
var Set = require("collections/set");
var parser = require('./parser');
var linq = require('linq');
var math = require('mathjs');

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
        var found = _.some(cadeias, function(arrays){
            // Sem Lodash
            //var b1 = arrays.indexOf(par[0]) != -1;
            //var b2 = arrays.indexOf(par[1]) != -1;
            //return b1 && b2;
            
            return _.includes(arrays, par[0]) && _.includes(arrays, par[1]);
        });
        return found;
    }
}

function Kappa(n, c){
    // soma de cada classe
    this.ci1 = 0;
    this.ci2 = 0;
    // somatório de S para cada classe
    this.z = 0;
    // consenso total = Z/N
    this.pa = 0;
    // consendo esperado por chance de anotação
    // ((C1/NC)ˆ2) + ((C2/NC)ˆ2)
    this.pe = 0;
    // tamanho da amostra
    this.n = n;
    // quantidade de anotadores
    this.c = c;
    // número total de anotações (N*C)
    this.nc = this.n * this.c;
    // coeficiente de consenso	Kappa=(P(A)-P(E))/(1-P(E))
    this.valor = 0;

    this.calcularKappa = function(concordancia){
        concordancia.gerarConcordancias();

        this.z = linq.from(concordancia.pares.toArray()).sum("$.s");

        this.ci1 = concordancia.c1;
        this.ci2 = concordancia.c2;

        this.pa = (this.z/this.n);
        
        var i1= this.ci1 / this.nc;
        var i2= this.ci2 / this.nc;

        this.pe = math.pow(i1, 2) + math.pow(i2, 2);
        this.valor = (this.pa - this.pe) / (1 - this.pe);

        if (isNaN(this.valor))
            this.valor = 1;
    }
}

function Par(sintagma1, sintagma2){
    this.sintagma1 = sintagma1;
    this.sintagma2 = sintagma2;

    this.c1 = 0;
    this.c2 = 0;
    this.s = 0;

    this.descricao = "";

    this.asArray = function(){
        return [sintagma1, sintagma2];
    }

    this.concordancia = function(arquivos){
        var par = this;
        var c = arquivos.length;
        _.forEach(arquivos, function(arquivo){
            if (arquivo.hasParEmCadeia(par.asArray())){
                par.c1++;
            }else{
                par.c2++;
            }
        });
        this.s = (1/(c*(c-1))) * (this.c1*(this.c1-1)+this.c2*(this.c2-1));
        //this.s = (1/c*(c-1)) * (this.c1*(this.c1-1) + this.c2*(this.c2-1));

    }

    this.gerarDescricao = function(){
        this.descricao = "Par: (" +this.sintagma1 + " - " + this.sintagma2 + ")";        
    }

    this.toString = function(){
        return this.descricao + ";" + this.c1 + ";" + this.c2 + ";" + this.s;
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
    /*
    if (arquivos.length % 2 != 0){
        throw "Impossível fazer concordância de Qtd's impares de anotadores"
    }
    */
    this.arquivos = arquivos;
    this.sintagmasEmCadeias = new Set();
    this.pares = new Set();
    this.c1 = 0;
    this.c2 = 0;

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
        var arquivos = this.arquivos;
        var c1 = 0;
        var c2 = 0;
        this.pares.forEach(function(_par){
            _par.concordancia(arquivos);
            c1+=_par.c1;
            c2+=_par.c2;
        });

        this.c1=c1;
        this.c2=c2;
    }

    // Gera array com um pedaço dos pares pra desenhar na tela ...
    this.samplePares = function(size){
        saida = _.slice(this.pares.toArray(), 0, size);
        _.forEach(saida, function(par){
            par.gerarDescricao();
        });
        return saida;
    }

    this.getDivergentes = function(){
        var pares = this.pares.toArray();
        var divergentes = linq.from(pares).where("$.c1 != 0 && $.c1 != " + this.arquivos.length).toArray();
        return divergentes;
    }

    this.qtdDivergentes = function(){
        var pares = this.pares.toArray();
        var _qtds = [];
        for (var i = 1; i < this.arquivos.length; i++){
            var qtds = linq.from(pares).count("$.c1 == " + i);
            var legenda = { c1 : i, c2 : this.arquivos.length - i, total : qtds};
            _qtds.push(legenda);
        }
        return _qtds;
    }

    this.tamanhoAmostra = function(){
        return this.pares.length;
    }

    this.anotadores = function(){
        return this.arquivos.length;
    }

    this.toParesString = function(){
        var _pares = "";
        this.pares.forEach(function(value){
            //_pares.add(value.toString());
            _pares+=value.toString()+"\n";
        });

        return _pares;
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
    kappa = new Kappa(concordancia.tamanhoAmostra(), concordancia.anotadores());
    kappa.calcularKappa(concordancia);

    return kappa;
}

module.exports = { concordancia : gerarConcordancias, kappa : gerarKappa };