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
app.use('/kappas', kappas.router);

app.get('/', function(request, response) {
  response.render('info.njk');
});

app.get('/textos', function(request, response) {
  var correls = arquivos.read_dir('./correlacoes/', '/arquivos/correlacoes/');
  var correfs = arquivos.read_dir('./correferencias/', '/arquivos/correferencias/');
  var concordancias = arquivos.texts("./kappas/");
  
  var _kappas = kappas.kappaCorref(concordancias[0]);

  template={
      correls:correls, 
      correfs:correfs, 
      concordancias : concordancias,
      kappa : _kappas.kappa, 
      pares : _kappas.pares
  };

  response.render('textos.njk', template);
});

app.listen(app.get('port'), function() {
   console.log('Application Runing on Port ', app.get('port'));
 });