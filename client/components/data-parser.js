import Parser from 'simple-text-parser';

rawTextToJson = function (rawText) {

  console.log('rawTextToJson');
  // var fs = require('fs');
  // var Parser = require("simple-text-parser"),
  parser = new Parser();
  console.log(parser);

  // require.extensions['.txt'] = function (module, filename) {
  //   module.exports = fs.readFileSync(filename, 'utf8');
  // };

  // var words = require("./input.txt");
  var words = rawText;
  var wordsz = words.replace(/^\n/gm, '');
  // vire toutes les lignes vides

    parser.addRule(/\%{3}.+/g, function(content){
    cleantext = content.substr(4)
    return{text:cleantext, type:"comment"}
  })

  parser.addRule(/\#.+/gm, function(content){

    var contentz = content.replace(/\n/gm, '');
    // pour virer les incohérences avec les newlines de mairde
    var regexBalise = new RegExp(/^#(\w{0,}) (.+)/gm)
    var contentzarray = regexBalise.exec(contentz)
      
    var cleanbalise = contentzarray[1]
    var cleantexte = contentzarray[2]

    contentzarray.shift()

    console.log(" contentzarray " +contentzarray + "cleantexte ="+ cleantexte, " cleanbalise ="+ cleanbalise)

    return {text:cleantexte, type:cleanbalise}
  });

  parser.addRule(/\n/gm, function(videur){
  //  videur = ""
  //  return {text:videur, type:"blanc"}
    // ça c'est pour si tu veux mettre des blancs entre chaque ligne tu connais?
    return false
    // ben lui tu vois il sert à la fois à splitter et a caler des blancs.
  });

  var parsed = parser.toTree(wordsz);
  var cleanArray = []
  // ici gros case avec les délimiteurs qui balance les trucs dans les bonnes collections?
  SuperLineIndex = false

  for(i=0;i<parsed.length;i++){
    console.log("index actuel "+i+' = ', parsed[i], parsed[i]["text"])
    // if (SuperLineIndex === false) {
      if(parsed[i]["text"]=="***"){
        SuperLineIndex = cleanArray.length
        cleanArray.push({"type": "text", "text": []})
        console.log("ici il y a un délimiteur "+SuperLineIndex)
      }else{
      // if(parsed[i]["text"]=="***"){
      //   SuperLineIndex = false
      //   console.log("c'est la fin du blob de texte "+SuperLineIndex)
      // }

      // if(SuperLineIndex==i-1){
      //   console.log("c'est la ligne française ", i)

      //   var WhichBalise = parsed[i]["type"]
      //   console.log("WhichBalise ", WhichBalise)
      //   var WhichText = parsed[i]["text"]
      //   var objTemp = {}
      //   objTemp[WhichBalise] = WhichText
      //   cleanArray.push(objTemp)
      // }else{
        // nl ou en ? regex ? #NL_TEXT
        console.log("PARSED i ", parsed[i])
        var WhichBalise = parsed[i]["type"]
        console.log("WhichBalise ", WhichBalise)
        var WhichText = parsed[i]["text"]
        var objTemp = {}
        objTemp[WhichBalise] = WhichText

        console.log("c'est la ligne estrangiere ou pas ", i, WhichText)
        console.log(cleanArray, "salut je suis un cleanArray")
        // if(cleanArray.length == 0 || cleanArray.length < SuperLineIndex) {
        // console.log(cleanArray, "salut je rajoute un truc dans cleanArray")
        //   cleanArray.push({"type": "text", "text": []})
        // }
        cleanArray[SuperLineIndex]["text"].push(objTemp)
        // parsed.splice(i,1)
      // }
    }
    console.log(cleanArray, " CleanArray ICI")
  }


  console.log(JSON.stringify(parsed, null, 4));
  // $('#json-result').val(JSON.stringify(parsed, null, 4));
  return JSON.stringify(parsed, null, 4);
};



  /*loadJSON: function(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/libs/output.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);  
  },*/
  //fonction qui parse le JSON
  //et qui range dans un tableau numéroté
  //afin d'utiliser next() qui va faire défiler les textes/events du spectacle
  
  zoupageJSON = function(response, obj) {
    // Parse JSON string into object
    console.log("zoupageJSON");
    console.log(response, response.length);
    // var actual_JSON = JSON.parse(response);
    var actual_JSON = JSON.parse(response);
    console.log("actual_JSON");
    console.log(actual_JSON);
    for(i=0; i<actual_JSON.length; i++){
     // console.log(actual_JSON[i]["type"])
     if((actual_JSON[i]["text"]=="") && (actual_JSON[i]["type"]=="text")){
        console.log("cette ligne s'est fait zoupper ", actual_JSON[i])
      }else{
        obj.push(actual_JSON[i])
      }
      // là tu mets une condition pour qu'il pushe pas les trucs de texte vide sa mère
    }
    // for(i=0; i<actual_JSON.length; i++){
    //   obj.push(actual_JSON[i])
    // }
    console.log("demoData", obj, demoData);
    console.log("demoCompteur", demoCompteur);
    return obj;
  };