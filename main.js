var fs = require('fs')
  , flow = require('xml-flow')
  , inFile = fs.createReadStream('./H2-dftre765.txt.xml')
  , xmlStream = flow(inFile)
;

xmlStream.on('tag:Cadeias', function(cadeias) {
  console.log(cadeias);
});