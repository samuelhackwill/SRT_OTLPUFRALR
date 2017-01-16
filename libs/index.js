var fs = require('fs');
var Parser = require("simple-text-parser"),
parser = new Parser();

require.extensions['.txt'] = function (module, filename) {
	module.exports = fs.readFileSync(filename, 'utf8');
};

var words = require("./input.txt");
var wordsz = words.replace(/^\n/gm, '');
// vire toutes les lignes vides

parser.addRule(/\#.+/gm, function(content){

	var contentz = content.replace(/\n/gm, '');
	// pour virer les incohérences avec les newlines de mairde
	var contentzarray = contentz.match(/[^# ][a-zA-Z0-9\u00E0-\u00FC().'\[\]\;,_!?/:]{0,}/gm)
	var cleanbalise = contentzarray[0]
	contentzarray.shift()

	return { text:contentzarray, type:cleanbalise}
});

parser.addRule(/\n/gm, function(videur){
//	videur = ""
//	return {text:videur, type:"blanc"}
	// ça c'est pour si tu veux mettre des blancs entre chaque ligne tu connais?
	return false
	// ben lui tu vois il sert à la fois à splitter et a caler des blancs.
});

parser.addRule(/\%{3}.+/g, function(content){
	cleantext = content.substr(4)
	return{text:cleantext, type:"comment"}
})

var parsed = parser.toTree(wordsz);

var outputFilename = 'output.json';

fs.writeFile(outputFilename, JSON.stringify(parsed, null, 4), function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("JSON saved to " + outputFilename);
	}
}); 