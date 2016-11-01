

var express = require('express');
var fs = require('fs'),
xml2js = require('xml2js');

var app = express();

var parser = new xml2js.Parser();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  
  fs.readFile(__dirname + '/parse.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        response.send(result.Cadeias);
    });
  });
  
  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

