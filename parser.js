var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var _ = require('lodash');

var read_dir = function(dir, finish){

  var arquivos = fs.readdirSync(dir);
  var parsed = [];

  _.forEach(arquivos, function(value){
    
    var arquivo = fs.readFileSync(dir + "/" + value, 'utf8');

    parser.parseString(arquivo, function (err, result) {
          parsed.push(result.ConteudoXML.Cadeias);
    });

  });

  finish(parsed);

}

var read_file = function(file, finish){
  var arquivo = fs.readFileSync(file, 'utf8');
  parser.parseString(arquivo, function (err, result) {
          finish(result.ConteudoXML.Cadeias);
  });
}

module.exports = { dir : read_dir,  file : read_file };