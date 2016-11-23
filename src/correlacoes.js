var _ = require('lodash');

function Entidade(categoria, nome){
    this.categoria = categoria;
    this.nome = nome;
}

function Correlacao(texto, entidade1, entidade2, relacao, descritor){
    this.texto = texto;
    this.entidade1 = entidade1;
    this.entidade2 = entidade2;
    this.relacao = relacao;
    this.descritor = descritor;
}

function Kappa(correlacoes){

    // soma de cada classe
    var ci = 0;
    // consenso entre os anotadores para cada relação	
    // ex: S1=(1/(C*(C-1))) * (C1*(C1-1) + (C2*(C2-1))
    var si = 0;
    // somatório de Si
    var z = 0;
    // consenso total = Z/N
    var P_A = 0;
    // número total de anotações (N*C)
    var NC = 0;
    // consendo esperado por chance de anotação
    // ((C1/NC)ˆ2) + ((C2/NC)ˆ2)
    var P_E = 0;
    // tamanho da amostra
    var N = 0;
    // quantidade de anotadores
    var C = 0;
    // coeficiente de consenso	Kappa=(P(A)-P(E))/(1-P(E))
    var Kappa = 0;


}

function SomatorioAnotadores(correlacoes){
    linhas=[];

    _.forEach(correlacoes, function(key, value){

    });
    
}
// indice 0, do arquivo correlacoes1 foi o João, indice 1 o Pedro
// 1o tem que pegar o correlacoes1 de todos os indices
[ { 
    correlacoes1 : [{
        texto : 'lalala', 
        entidade1 :  { categoria : 'ORG', nome : 'PUC' },
        entidade2 : { categoria : 'PES', nome : 'Rodney'},
        relacao : true,
        descritor : 'aluno da'
    }]
},

{   
    correlacoes1 : 
        [
            {
            texto : 'lalala', 
            entidade1 :  { categoria : 'ORG', nome : 'PUC' },
            entidade2 : { categoria : 'PES', nome : 'Rodney'},
            relacao : true,
            descritor : 'aluno da'
            }
        ]
    

}];