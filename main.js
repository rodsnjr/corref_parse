var express = require('express');
var nunjucks = require('nunjucks');
var arquivos = require('./src/arquivos');	
var parser = require('./src/parser');
var kappas = require('./src/kappas');

var app = express();

// Templating
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use('/arquivos', arquivos.router);
app.use('/kappas', kappas);

app.get('/', function(request, response) {
  response.render('info.njk');
});

app.get('/textos', function(request, response) {
  var correls = arquivos.read_dir('./correlacoes/', '/arquivos/correlacoes/');
  var correfs = arquivos.read_dir('./correferencias/', '/arquivos/correferencias/');

  var concordancias = {
    
  }

  response.render('textos.njk', {correls:correls, correfs:correfs});
});

app.listen(app.get('port'), function() {
   console.log('Node app is running on port', app.get('port'));
 });