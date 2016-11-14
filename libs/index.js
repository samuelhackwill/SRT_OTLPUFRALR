var fs = require('fs');
var Parser = require("simple-text-parser"),
parser = new Parser();

require.extensions['.txt'] = function (module, filename) {
	module.exports = fs.readFileSync(filename, 'utf8');
};

var words = require("./input.txt");

parser.addRule(/\%{3}.+/g, function(content){
	cleantext = content.substr(4)
	return{text:cleantext, type:"comment"}
})


parser.addRule(/\n/g, function(videur){
	videur = ""
	return {text:videur, type:"blanc"}
	// ben lui tu vois il sert à la fois à splitter et a caler des blancs.
	// bon mais euh là il y a des incohérences
	// genre par exemple quand il y a un commentaire, ça fait qu'il y a des doublancs
});

parser.addRule(/\#.+/g, function(content){

	cleaninstruct = content.substr(3)
	cleanbalise = content.substr(1,1)
	return { text:cleaninstruct, type:"balise", balise:cleanbalise}
	// le plan c'est qu'on mette en place une codification des balises
	// genre b=apparition des boutons
	// mais bon euh est ce que ça va bien scale tout ça? hmmm
});

var parsed = parser.toTree(words);

var outputFilename = 'output.json';

fs.writeFile(outputFilename, JSON.stringify(parsed, null, 4), function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("JSON saved to " + outputFilename);
	}
}); 