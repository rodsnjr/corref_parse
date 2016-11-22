var express = require('express');
var nunjucks = require('nunjucks');
var arquivos = require('./arquivos');	
var parser = require('./parser');
var kappas = require('./kappa');
var app = express();

// Templating
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use('/arquivos', arquivos);
app.use('/kappas', kappas);

app.get('/', function(request, response) {
  response.render('info.njk');
});

app.listen(app.get('port'), function() {
   console.log('Node app is running on port', app.get('port'));
 });