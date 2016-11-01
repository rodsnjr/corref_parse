var fs = require('fs')
  , flow = require('xml-flow')
  , inFile = fs.createReadStream('./H2-dftre765.txt.xml')
  , xmlStream = flow(inFile)
;

var express = require('express');
var app = express();

var fs = require('fs')
  , flow = require('xml-flow')
  , inFile = fs.createReadStream('./H2-dftre765.txt.xml')
  , xmlStream = flow(inFile)
;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  xmlStream.on('tag:Cadeias', function(cadeias) {
    response.send(cadeias);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

