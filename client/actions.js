// actions - fonctions pour le spectacle textes images questions/reponses etc...

// TO DO
// balises pour afficher du texte ailleurs que dans SRT (checklist, rubrique fiction)

compteurquest = -1
compteur = -1
// ça c'est pour commencer au 0 du tableau.
interupt = false
indeximg = 0
alternance = false
autonextcontainer = null
flipbookstatus = false
clock = null
timerDone = false

data = []

posanswers =["disponible", "à la maison", "tranquille", "son ok", "concentré"]
neganswers =["occupé","en ville","pas seul", "mute", "distrait"]

function loadJSON(callback) {   

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'libs/output.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
    callback(xobj.responseText);
  }
};
xobj.send(null);  
}

//usage:
function zoupage() {

   loadJSON(function(response) {
    // Parse JSON string into object
    var actual_JSON = JSON.parse(response);

    for(i=0; i<actual_JSON.length; i++){
      data.push(actual_JSON[i])
    }
  });
}

next = function(){
  //TODO
  //attention dans le cas actuel il est impossible d'avoir la div de texte vide. il faudrait avoir une balise
  //action spécifique pour vider la div
  //solution envisagée :
  //au moment de parser data, il rajoute une balise #clear une ligne sur deux par exemple
  console.log('next', data);
  var currentData = data[compteur]
  var type = currentData["type"]
  var params = currentData["text"]

  while(data[compteur]["type"]!="text"){
      // tant que data[compteur] est une balise, ben continue à executer les instructions s'il te plaît
      action(type, params)
      if((data[compteur]["type"]!="text")||(data[compteur]["text"]=="")){
        // euh alors ça je sais pas pourquoi ça marche mais ça permet d'éviter des situations où, arrivé à un bookmark
        // il sautait deux lignes au lieu d'une
        compteur+=1;
        next();
      }
    }

    if((type=="text")&&(params!="")){
      document.getElementById("srt").innerHTML = params
      // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
      // bon ben c'est ici qu'il faudrait faire un truc
      if(params=="***"){
        // ça c'est pour caler des blancs
        document.getElementById("srt").innerHTML = ""
      }
    }
  }

  action = function(type, params){
    switch(type){
      case "addclass":
      addclass(params)
      break

      case "removeclass":
      removeclass(params)
      break

      case "addlistelement":
      addlistelement(params)
      break

      case "flipbook":
      console.log(flipbookstatus)
      flipbook()
      break

      case "autonext":
      autonext(params)
      break

      case "stop":
      interupt=true
      console.log("stoooooop!")
      break

      case "goto":
      gotobookmark(params)
      break

      case "gotonext":
      gotonext(params)
      break

      case "btn":
      $("#sacbouttons").removeClass("invisible")
      newBoutton(params)
      break

      case "img":
      // IMAGE
      // trigger pour enclencher un fadeout styled
      if(alternance){
        changeImg(params)
      }else{
        changeImg(params)
      }
      alternance =! alternance
      break;

      case "fullscreen":
      fullscreen();
      break;

      case "timer":
      console.log("TIMER!!!!!")
      timerZob()
      break;
    }
  }

    flipbook = function(){
      if(flipbookstatus==true){
        $("#flipbookcontainer").removeClass("visible")
        $("#flipbookcontainer").addClass("invisible")
        var zoupla = setTimeout(function(){
          $("#flipbookcontainer").css("display", "none")},1000)
      }else{
        flipbookstatus = true
        $("#flipbookcontainer").css("display", "inline-block")
        var zoupla = setTimeout(function(){
          $("#flipbookcontainer").removeClass("invisible")
          $("#flipbookcontainer").addClass("visible")},1000)
      }
    }

    timerZob = function(){
      // le timer ci-dessous
        interupt = true
        clock = setInterval(get_time_diff, 1000)
      }

        get_time_diff = function( datetime )
        {
          console.log("timerDone?", timerDone)
          if(!timerDone) {

            var datetime = typeof datetime !== 'undefined' ? datetime : "2017-01-12 16:22:00.000000"
            var datetime = new Date( datetime ).getTime();
            var now = new Date().getTime();

            if( isNaN(datetime) )
            {
              return ""
            }

            if (datetime < now) {
              var milisec_diff = now - datetime
            }else{
              var milisec_diff = datetime - now
            }

            var date_diff = new Date( milisec_diff )

            var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24))
            var hours = date_diff.getHours()
            var minutes = date_diff.getMinutes()
            var secondes = date_diff.getSeconds()

            var difdif = ""
            if(days>1) var difdif = difdif.concat(days.toString(), " jours et ")
              if(days==1) var difdif = difdif.concat(days.toString(), " jour et ")
                if(hours!=0) var difdif = difdif.concat(hours.toString(), ":")
                  if(minutes!=0) var difdif = difdif.concat(minutes.toString(), ":")

                    var difdif = difdif.concat(secondes.toString(), " <br> avant le début du spectacle à la maison.")

                  document.getElementById("srt").innerHTML = (difdif)

                  if (datetime-now < 0) {
                    interupt = false
                   console.log("TOOT TOOT TOOT c'est l'heure du spectacle", timerDone)
                    timerDone = true
                   console.log("TOOT TOOT TOOT c'est l'heure du spectacle", timerDone)
                   gotonext(1)
                   clearInterval(clock)
                 }

            }
        }


       addFiction = function(params){
        var ul = document.getElementById("elemfiction")
        var li = document.createElement("li")
        li.setAttribute("id", phrase)
        li.appendChild(document.createTextNode(phrase))
        ul.appendChild(li)
      }

      removeFiction = function(params){
        var li = document.getElementById(phrase);
        if(li!=null){
          li.parentNode.removeChild(li);
        }else{
          console.log("ERR cannot find element '"+ phrase + "'")
        }
      }

      changeImg = function(params){

        if (alternance) {
          $("#imgcontainerFRONT").css("background-image", "url(/img/"+params[0]);  
          $("#imgcontainerFRONT").css("opacity", "1");  
        }else{
          $("#imgcontainerBACK").css("background-image", "url(/img/"+params[0]);  
          $("#imgcontainerFRONT").css("opacity", "0");  
        }
        console.log(alternance)
        console.log(params[0])
      }

      autonext = function(params){
        var wait = params

        console.log("plonk "+wait)
        autonextcontainer = setTimeout(function(){
          gotonext(1)
          console.log("plonk plonk")
        },wait)}

        addclass = function(params){
          console.log("addclass, ", params[0], params[1])
          $("#"+params[0]).addClass(params[1])
        }

        removeclass = function(params){
          console.log("removeclass, ", params[0], params[1])
          $("#"+params[0]).removeClass(params[1])
        }

        answernext = function(params){
          compteurquest += 1
          console.log("answernext, "+params+ "compteurq ="+compteurquest)
          if(params=="ok") addlistelement(['checklist',posanswers[compteurquest], params])
            if(params=="nope") addlistelement(['checklist',neganswers[compteurquest], params])

              if(compteurquest>=4) destroy("seqoui")
            }


           addlistelement = function(params){

            console.log("les params chelous ", params)
            var where = params[0]
            var label = params[1]
            var status = params[2]

            var labelpropre = label.replace(/\_/g, ' ');

            var newListel = $('<li class='+ status +'>'+ labelpropre +'</li>')
            newListel.appendTo($("#"+where))

          }

          newBoutton = function(params){
            interupt=true

            var fonctions = []
            var nom = params[0]
            params.shift()
            var label = params[0]
            var labelpropre = label.replace(/\_/g, ' ');

            params.shift()

            var howmany = params.length
            for(i=0; i<howmany; i++){
              fonctions.push(params[i])
              fonctionsconcat = fonctions.join(";")
            }

            var newBoutton = $('<input type="button" value="'+ labelpropre +'" id="'+ nom +'" onclick = "' + fonctionsconcat + '">')
            newBoutton.appendTo($("#sacbouttons"))
          }

          fullscreen = function(){
            var i = document.getElementById("gcontainer");
            if (i.requestFullscreen) {
              i.requestFullscreen();
            } else if (i.webkitRequestFullscreen) {
              i.webkitRequestFullscreen();
            } else if (i.mozRequestFullScreen) {
              i.mozRequestFullScreen();
            } else if (i.msRequestFullscreen) {
              i.msRequestFullscreen();
            }
          }

// FUNCTION DESTROY
// dans l'idéal faudrait lui passer un délai également
destroy = function(self){
  var delay = 333
  var element = document.getElementById(self)
  var parentid = element.parentNode.id

  $("#"+parentid).addClass("invisible")

  setTimeout(function(){
    $("#"+parentid).empty()
  },delay)
}

gotobookmark = function(where){
  if(interupt==true) interupt=false
    howmuch = data.length
  for(i=0; i<howmuch; i++){
    if((data[i]["type"]=="bookmark")&&(data[i]["text"]==where)){
      //ça c'est la valeur de ton compteur mon ptit gars
      compteur = i
      setTimeout(function(){
        next()
      },333)
      console.log("gotobookmark, ", compteur)
      return
    }
  }
}

gotonext = function(params){
  var bonus = parseInt(params)
  compteur += bonus
  next()
  interupt=false
  console.log("gotonext, ", params)
}