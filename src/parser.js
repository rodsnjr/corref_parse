var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var _ = require('lodash');
var linq = require("linq");

var get_cadeias = function (result) {
  var saida = [];
  _.forEach(result.ConteudoXML.Cadeias[0], function (value, key) {
    var cadeia = [];
    var _categoria = undefined;
    _.forEach(value[0].sn, function (value1, key1) {
      cadeia.push(value1.$);
      _categoria = _categoria || value1.$.Categoria;
    });
    saida.push({ id: key, content: cadeia, categoria: _categoria });

  });
  return saida;
}

var get_mencoes = function (result) {
  //var saida = result.ConteudoXML.Mencoes_Unicas[0].sn;
  var saida = [];
  _.forEach(result.ConteudoXML.Mencoes_Unicas[0].sn, function (value, key) {

    saida.push(value.$);

  });
  return saida;
}

var get_ids = function (result) {
  var saida = [];
  _.forEach(result.ConteudoXML.Cadeias[0], function (value, key) {
    var cadeia = [];
    _.forEach(value[0].sn, function (value1, key1) {
      cadeia.push(value1.$.id);
    });
    //saida.push({ id: key, content: cadeia });
    saida.push(cadeia);
  });
  return saida;
}

var get_cadeias_ids_sintagmas = function (result) {
  var cadeia = [];
  _.forEach(result.ConteudoXML.Cadeias[0], function (value, key) {
    
    _.forEach(value[0].sn, function (value1, key1) {
      cadeia.push({ id: value1.$.id, sintagma: value1.$.sintagma });
    });
    //saida.push(cadeia);
  });
  return cadeia;
}

var get_sentencas = function (result) {
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
  else if (conteudo == 'mencoes') {
    return get_mencoes(result);
  } else if (conteudo == 'ids') {
    return get_ids(result);
  }
  else if (conteudo == 'cadeia_ids_sintagmas') {
    return get_cadeias_ids_sintagmas(result);
  }
  else if (conteudo == 'sentencas') {
    return get_sentencas(result);
  }
  else if (conteudo == 'texto') {
    return result.ConteudoXML.Texto[0].$.conteudo;
  } else if (conteudo == '') {
    return result.ConteudoXML;
  }
}

var parse_xml = function (arquivo, parametro) {
  parsed = {};
  parser.parseString(arquivo, function (err, result) {
    if (typeof parametro == 'string') {
      parsed = get_conteudo(result, parametro);
    } else {
      _.forEach(parametro, function (value) {
        parsed[value] = get_conteudo(result, value);
      });
    }
  });
  return parsed;
}

var read_dir = function (dir, parametro, finish) {

  var arquivos = fs.readdirSync(dir);
  var parsed = [];

  _.forEach(arquivos, function (pasta) {

    if (fs.lstatSync(dir + pasta).isDirectory()) {
        var files = get_files(dir + pasta, parametro);
        parsed = parsed.concat(files);
    } else {
      try {
        parsed.push(get_file(pasta, file, parametro));
      } catch (e){
        console.log(e);
      }      
    }

  });

  finish(parsed);

}

var even_files = function(dir){
  
  even=[];

  var prop = { fileName : true, dados : 'texto' };

  arquivos = read_dir(dir, prop, function(textos){
    
    _.forEach(textos, function(texto){

      var evens = linq.from(textos)
        .where(function(item){ return item.texto==texto.texto && item != texto })
        .select("$.name")
        .toArray();
      
      if (!linq.from(even).contains(evens)){
        even = even.concat(evens);
      }       

    });
    
  });

  return even;
}

var get_file = function(file, _path, parametro){
    var arquivo = fs.readFileSync(_path, 'utf8');
    if (parametro.fileName){
      var _file = { name : file };
      var _xml = parse_xml(arquivo,parametro).texto;
      var exit = _.merge(_file, {texto : _xml});
      
      return exit;

    }
    else
      return parse_xml(arquivo, parametro);
}

var get_files = function (dir, parametro, parsed) {
  var parsed=[]
  var arquivos = fs.readdirSync(dir);

  _.forEach(arquivos, function (file) {
    if (parametro.name) {
      if (parametro.name == file) {
        parsed.push(get_file(file, dir + "/" + file, parametro.dados));
      }
    }else{
      parsed.push(get_file(file, dir + "/" + file, parametro));
    }
    
  });

  return parsed;

}

var read_file = function (file, parametro, finish) {
  var arquivo = fs.readFileSync(file, 'utf8');

  finish(parse_xml(arquivo, parametro));

}

module.exports = { dir: read_dir, file: read_file, even : even_files };