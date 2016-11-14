  var fs = require('fs');
  var toJSON = require('plain-text-data-to-json');

  var doc = fs.readFileSync('input.txt', 'utf8');

// Transform: 
var data = toJSON(doc);

fs.writeFileSync('output.json', JSON.stringify(data, null, 2) + '\n');
