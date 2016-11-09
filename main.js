var express = require('express');
var nunjucks = require('nunjucks');
var arquivos = require('./arquivos');
var app = express();

// Templating
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use('/arquivos', arquivos);

app.get('/', function(request, response) {
  response.render('layout.njk');
});

app.listen(app.get('port'), function() {
   console.log('Node app is running on port', app.get('port'));
 });