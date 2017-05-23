import Parser from 'simple-text-parser';
import lodash from 'lodash';

_ = lodash;

dataBalises = {
  "data": ["FR_SALM", "FR_CYCLO", "FR_DECR", "NL_CYCLO", "EN_CYCLO", "NL_SALM", "EN_SALM", "FR_INTR", "NL_INTR"],
  "dataPupitre": ["FR", "NL", "NL_SAT", "EN", "EN_SAT"]
}

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

  parser.addRule(/%{3}.+/g, function(content){
    cleantext = content.substr(4)
    return{text:"", type:"text"}
  })

  parser.addRule(/^(.+)?#(\w{0,})\s?(.+)?/gm, function(content){

    var contentz = content.replace(/\n/gm, '');
    // pour virer les incohérences avec les newlines de mairde
    var regexBalise = new RegExp(/^(.+)?#(\w{0,})\s?(.+)?/gm)
    var contentzarray = regexBalise.exec(contentz)
      console.log('REGEX BRUN')
      for (var i = 0; i < contentzarray.length; i++) {
        console.log('REGEX BRUN '+i, contentzarray[i])
      }
    // var didascalie = contentzarray[1]
    var cleanbalise = contentzarray[2]
    var cleantexte = contentzarray[3]

    // contentzarray.shift()

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
  console.log("parsed = ", parsed)
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
        console.log("PARSED i ", parsed[i])
        var WhichBalise = parsed[i]["type"]
        console.log("WhichBalise ", WhichBalise)
        var WhichText = parsed[i]["text"]
        //todo pas du texte multilingue
        if(dataBalises.data.indexOf(WhichBalise) == -1 && dataBalises.dataPupitre.indexOf(WhichBalise) == -1) {
          cleanArray.push({"type": WhichBalise, "text": WhichText})
        } else {
          // nl ou en ? regex ? #NL_TEXT
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
        }
      // }
    }
  }
  console.log(cleanArray, " CleanArray ICI")


  // console.log(JSON.stringify(parsed, null, 4));
  //$('#json-result').val(JSON.stringify(parsed, null, 4));
  return JSON.stringify(cleanArray, null, 4);
}



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

  zoupageJSON = function(sourceData) {
    // Parse JSON string into object
    console.log("zoupageJSON", sourceData);
    console.log("length", sourceData.length);
    // var actual_JSON = JSON.parse(response);
    var actual_JSON = JSON.parse(sourceData);
    // console.log("actual_JSON");
    // console.log(actual_JSON);
    // var dataBalises = {
    //   "dataPupitre": ["FR", "NL", "NL_SAT", "EN", "EN_SAT"],
    //   "data": ["FR_SALM", "FR_SAT", "NL_SALM", "EN_SALM"]
    // }
    var obj = []
    for(i=actual_JSON.length - 1; i >= 0; i--){
      if(Array.isArray(actual_JSON[i]["text"])){
        console.log("text array?", actual_JSON[i]["text"])
        for(j=actual_JSON[i]["text"].length-1; j >= 0; j--){
          console.log("text?", actual_JSON[i]["text"][j])
          if(actual_JSON[i]["text"][j].hasOwnProperty("text")){

            actual_JSON[i]["text"].splice(j, 1)
            console.log("une ligne a été zouppée ", actual_JSON[i])
            if(actual_JSON[i]["text"].length == 0) actual_JSON.splice(i, 1)
          }else{
            // obj.push(actual_JSON[i])
          }
        }
      } else {
        // là tu mets une condition pour qu'il pushe pas les trucs de texte vide sa mère
        if(actual_JSON[i]["type"] == "text") { //c'est du texte vide
          actual_JSON.splice(i, 1)
        }
      }
    }
    console.log('new actual_JSON = ', actual_JSON);
    var dataObj = _.cloneDeep(actual_JSON);
    var dataPupitreObj = _.cloneDeep(actual_JSON);
     // console.log(obj[i]["type"])
    console.log('ITERATION obj pour dataObj');

    for(i=dataObj.length - 1; i >= 0; i--){
      if(Array.isArray(dataObj[i]["text"])){
        for(j=dataObj[i].text.length-1; j>=0; j--){
          console.log(dataObj[i]["text"][j])
            console.log("j?", j)
          console.log("length de databalises data " + dataBalises.data.length)
          var found = false
          for(k=dataBalises.data.length-1; k>=0 ; k--){
            console.log("j2?", j, dataObj[i]["text"])
            console.log(dataBalises.data[k])
            console.log(dataObj[i]["text"][j])
            if (dataObj[i]["text"][j].hasOwnProperty(dataBalises.data[k])) {
              console.log("ZOUPE MOI CETTE LIGNE FISSA ", dataBalises.data[k], dataObj[i]["text"][j][dataBalises.data[k]])
              // dataObj.push(dataBalises.data[k], obj[i]["text"][j][dataBalises.data[k]])
              found = true;
            } else {

            }
          }
          if(found == false) {
            console.log("je splice cette ligne de texte", j, dataObj[i]["text"][j])
            dataObj[i]["text"].splice(j, 1)
          }
        }
        if(dataObj[i].text.length == 0) {
          console.log("j'ai pas trouvé de balise qui m'intéresse, jartons cet objet")
          dataObj.splice(i, 1)
        }
      }
    }

    console.log("dataObj", dataObj);
    console.log('ITERATION obj pour dataPupitreObj');
    console.log("dataPupitreObj", dataPupitreObj);

    for(i=dataPupitreObj.length - 1; i >= 0; i--){
      if(Array.isArray(dataPupitreObj[i]["text"])){
        for(j=dataPupitreObj[i].text.length-1; j>=0; j--){
          console.log(dataPupitreObj[i]["text"][j])
            console.log("j?", j)
          console.log("length de databalises dataPupitre " + dataBalises.dataPupitre.length)

          var found = false
          for(k=dataBalises.dataPupitre.length-1; k>=0 ; k--){
            console.log(dataBalises.dataPupitre[k])
            if (dataPupitreObj[i]["text"][j].hasOwnProperty(dataBalises.dataPupitre[k])) {
              console.log("dataPupitre ZOUPE MOI CETTE LIGNE FISSA ", dataBalises.dataPupitre[k], dataPupitreObj[i]["text"][j][dataBalises.dataPupitre[k]])
              // dataPupitreObj.push( dataPupitreObj[i]["text"][j][dataBalises.dataPupitre[k]])
              found = true;
            } else {

            }
          }
          if(found == false) {
            console.log("je splice cette ligne de texte", j, dataPupitreObj[i]["text"][j])
            dataPupitreObj[i]["text"].splice(j, 1)
          }
        }
        if(dataPupitreObj[i].text.length == 0) {
          console.log("j'ai pas trouvé de balise qui m'intéresse, jartons cet objet")
          dataPupitreObj.splice(i, 1)
        }
      }
    }


    console.log("dataPupitreObj", dataPupitreObj);

    // for(i=0; i<actual_JSON.length; i++){
    //   obj.push(actual_JSON[i])
    // }
    // console.log("demoData", obj, demoData);
    // console.log("demoCompteur", demoCompteur);
    return {
      data: dataObj, 
      dataPupitre: dataPupitreObj
    };
  }