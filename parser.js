var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var _ = require('lodash');

var get_cadeias = function (result) {
    var saida = [];
    _.forEach(result.ConteudoXML.Cadeias[0], function (value, key) {
      var cadeia = [];
      var _categoria = undefined;
      _.forEach(value[0].sn, function (value1, key1) {
        cadeia.push(value1.$);
        _categoria= _categoria || value1.$.Categoria;
      });
      saida.push({ id: key, content: cadeia , categoria : _categoria});
      
    });
    return saida;
}

var get_mencoes = function(result){
    //var saida = result.ConteudoXML.Mencoes_Unicas[0].sn;
    var saida=[];
    _.forEach(result.ConteudoXML.Mencoes_Unicas[0].sn, function (value, key) {
      
      saida.push(value.$);
      
    });
    return saida;
}

var get_kappas = function(result){
      var saida = [];
    _.forEach(result.ConteudoXML.Cadeias[0], function (value, key) {
      var cadeia = [];
      _.forEach(value[0].sn, function (value1, key1) {
        cadeia.push(value1.$.id);
      });
      saida.push({ id: key, content: cadeia });
      
    });
    return saida;
}

var get_sentencas = function(result){
  var saida = [];
  _.forEach(result.ConteudoXML.Sentencas[0], function (value, key) {
    saida.push({ id: key, content: value[0].$.conteudo });
  });
  return saida;
}

var get_conteudo = function (result, conteudo) {
    if (conteudo == 'cadeias') {
      return get_cadeias(result);
    }
    else if (conteudo == 'mencoes'){
      return get_mencoes(result);
    }
    else if (conteudo == 'kappa'){
      return get_kappas(result);
    }
    else if (conteudo == 'sentencas') {
      return get_sentencas(result);
    }
    else if (conteudo == 'texto'){
      return result.ConteudoXML.Texto[0].$.conteudo;
    }else if (conteudo == ''){
      return result.ConteudoXML;
    }
}

var parse_xml = function(arquivo, parametro){
  parsed = {};
  parser.parseString(arquivo, function (err, result) {
    if (typeof parametro == 'string'){
      parsed = get_conteudo(result, parametro);
    } else{
      _.forEach(parametro, function(value){
        parsed[value] = get_conteudo(result, value);
      });
    }
  });
  return parsed;
}

var read_dir = function (dir, parametro, finish) {

  var arquivos = fs.readdirSync(dir);
  var parsed = [];

  _.forEach(arquivos, function (value) {

    var arquivo = fs.readFileSync(dir + "/" + value, 'utf8');

    parsed.push(parse_xml(arquivo, parametro));


  });

  finish(parsed);

}

var read_file = function (file, parametro, finish) {
  var arquivo = fs.readFileSync(file, 'utf8');

  finish(parse_xml(arquivo, parametro));

}

module.exports = { dir: read_dir, file: read_file };