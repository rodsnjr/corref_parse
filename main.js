var express = require('express');
var parser = require('./parser');
var nunjucks = require('nunjucks');

var app = express();

// Templating
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    
  
  parser.file('./correferencias/Rodney/1.xml', 
        ['texto', 'cadeias', 'sentencas'], function(valores){
          
          //response.send(valores);
          response.render('corref.njk', valores);

  });


});

app.get('/cadeias', function(request, response) {
    parser.file('./correferencias/H2-dftre765.txt.xml', 'cadeias', function(valores){
      response.send(valores);
    })
});

app.get('/sentenca', function(request,response){
  parser.file('./correferencias/H2-dftre765.txt.xml', 'sentencas', function(valores){
      response.send(valores);
  })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});