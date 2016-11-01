var express = require('express');
var parser = require('./parser');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    parser.dir('./public', function(cadeias){
      response.send(cadeias);
    })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});