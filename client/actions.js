// actions - fonctions pour le spectacle textes images questions/reponses etc...

// TO DO
// balises pour afficher du texte ailleurs que dans SRT (checklist, rubrique fiction)
// pour les variables globales, virer le var avant
// loadJSON = function(callback)

compteurquest = -1
compteur = -1
// ça c'est pour commencer au 0 du tableau.
interrupt = false
indeximg = 0
alternance = false
autonextcontainer = null
flipbookstatus = false
clock = null

data = []

etats = {
  e41:"rain1",
  e43:"rain2",
  e45:"rain1",
  e47:"rain2",
  e48:"rain3",
  e49:"rain1"
}

/*
posanswers =["disponible", "à la maison", "tranquille", "son ok", "concentré"]
neganswers =["occupé","en ville","pas seul", "mute", "distrait"]
*/

next = function(){
  //TODO
  //attention dans le cas actuel il est impossible d'avoir la div de texte vide. il faudrait avoir une balise
  //action spécifique pour vider la div
  //solution envisagée :
  //au moment de parser data, il rajoute une balise #clear une ligne sur deux par exemple
  console.log('next', compteur, data[compteur]);
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
    case "cue":
    cue(params)
    break

    case "sound":
    sound(params)
    break

    case "addclass":
    addclass(params)
    break

    case "jacky":
    jacky(params)
    break

    case "setdate":
    nextspectacledate = params[0] + " " + params[1]
    break

    case "time":
    time(params)
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

    // case "parking":
    // parking(params)
    // break

    case "stop":
    interrupt=true
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
    timer()
    break;
  }
}

sound = function(params){
  console.log("sound", params);
  if(params[0]=="start"){
    em.emit('adminstartstream');
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

/*
ça je m'en servais avant dans l'inscription pour donner rendez-vous aux gens 

time = function(params){
var nextsrt = compteur + 1

var stringdeb = params[0]
var stringfin = params[1] || ""
// bam pseudo-argument optionnel dans ta face

var stringdebpropre = stringdeb.replace(/\_/g, ' ');
var stringfinpropre = stringfin.replace(/\_/g, ' ');

var phrase = stringdebpropre + " le " + nextspectacledate + " à " + nextspectacletime + " " + stringfinpropre
var addobject = {text:phrase, type: "text"}

data.splice(nextsrt, 0, addobject, [type="text"])
}
*/

cue = function(params){
    if(Roles.userIsInRole(Meteor.user(), "admin")==true){
      alert(params)
    }
}


jacky = function(params){
  console.log("etes vous bien le jacky que nous cherchons?", params[0], params[1])
  if(Roles.userIsInRole(Meteor.user(), params[0])==true){
    console.log("l'user est bien le jacky que nous cherchons", params[0], params[1])
    gotobookmark(params[1])
  }
}

parking = function(params){
  // TO DO : A REFACTORER SALEMENT
  console.log("parking : is admin?");

  var fonctions = []
  var on_off = params[0]
  params.shift()

  var howmany = params.length
  for(i=0; i<howmany; i++){
    fonctions.push(params[i])
  }

  console.log("fonctions", fonctions);

  // if(Roles.userIsInRole(Meteor.user(), "admin")==true) {

    // console.log("parking : is admin");
    // var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    // var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : false;
    var isSUPERinterrupt = getSuperGlobal("SUPERinterrupt", false);
    console.log("parking : is isSUPERinterrupt", isSUPERinterrupt);
    if(SUPERinterrupt !== false) {
      var parkingRoles = fonctions;
      if(on_off=="ON"){
        console.log("parking : enable FOR ROLES -> ", parkingRoles);
        //ajouter roles dans le tableau SUPERinterrupt si pas déjà dedans
        for(i=0;i<parkingRoles.length;i++){
          console.log("user is in role", parkingRoles[i], " ?", Roles.userIsInRole(Meteor.user(), parkingRoles[i]));
          if((parkingRoles[i] == 'salm' && !Meteor.user()) || Roles.userIsInRole(Meteor.user(), parkingRoles[i])==true) {
            var found = jQuery.inArray(parkingRoles[i], isSUPERinterrupt);
            if (found >= 0) {
              // Element was found, don't add it again.
            } else {
              // Element was not found, add it.
              isSUPERinterrupt.push(parkingRoles[i]);
              console.log("parking : enabling for ", parkingRoles[i]);
            }
          }
        }
        
      //  SUPERinterrupt = true
      } else if(on_off=="OFF"){
        console.log("parking : disable FOR ROLES -> ", parkingRoles);
        //retirer roles du tableau SUPERinterrupt (si déjà dedans)
        for(i=0;i<parkingRoles.length;i++){
          var found = jQuery.inArray(parkingRoles[i], isSUPERinterrupt);
          if (found >= 0) {
            // Element was found, remove it.
            isSUPERinterrupt.splice(found, 1);
            console.log("parking : disabling for ", parkingRoles[i]);
          } else {
            // Element was not found, don't remove it.
          }
        }
      }
      // em.setClient({ value: isSUPERinterrupt });
      // em.emit('adminSUPERinterrupt');
      console.log("parking : new SUPERinterrupt = ", isSUPERinterrupt);
      Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: isSUPERinterrupt});
    }
  // } else {

    //  SUPERinterrupt = false
  // }
}

timer = function(){
  // le timer ci-dessous
  interrupt = true;
  clock = setInterval(get_time_diff(), 1000)
  console.log("go TIMER")
}

get_time_diff = function(datetime){
  console.log("go GET TIME DIFF");
  $("#srt").html("zoupla")
  // euh alors y'a un bug de timezone là j'ai l'impression qu'il prend greenwitch
  var datetime = typeof datetime !== 'undefined' ? datetime : "2017-01-21 21:29:99.000000"
  var datetime = new Date(datetime).getTime();

  console.log("datetime " + datetime)
  var now = new Date().getTime();

  if(isNaN(datetime)) return ""


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

  if (datetime-now <= -1) {
   console.log("TOOT TOOT TOOT c'est l'heure du spectacle")
   gotobookmark('spectacle')
   clearInterval(clock)
   interrupt=true
   gotonext(1)
  }

  console.log("difdif " + difdif)
  console.log("now " + now)
  console.log("date_diff " + date_diff)
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
    $("#imgcontainerFRONT").css("background-image", "url(/img/"+params+".jpg");  
    $("#imgcontainerFRONT").css("opacity", "1");  
  }else{
    $("#imgcontainerBACK").css("background-image", "url(/img/"+params+".jpg");  
    $("#imgcontainerFRONT").css("opacity", "0");  
  }
  console.log(alternance)
  console.log(params[0])
}

autonext = function(params){
  var wait = params

  console.log("DÉBUT autonext "+wait)
  autonextcontainer = setTimeout(function(){
    gotonext(1)
    console.log("FIN autonext ")
  },wait)
}

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
  if(compteurquest<4){
    interrupt=true
  }else{
    interrupt=false
    destroy("seqoui")
  }
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
  interrupt=true

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

  var newBoutton = $('<input type="button" class="button" value="'+ labelpropre +'" id="'+ nom +'" onclick = "' + fonctionsconcat + '">')
  newBoutton.appendTo($("#sacbouttons"))

  $("#sacbouttons").css("opacity", "1");  
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

destroy = function(self){
  // FUNCTION DESTROY
  // dans l'idéal faudrait lui passer un délai également
  var delay = 333
  var element = document.getElementById(self)
  var parentid = element.parentNode.id

  $("#"+parentid).css("opacity","0")


  setTimeout(function(){
    $("#"+parentid).empty()
  },delay)
}

gotobookmark = function(where){
  console.log("gotobookmark1!!? where=", where);
  if(typeof where !== 'string') where = where.toString();
  console.log("gotobookmark1b!!? where=", where);
  if(interrupt==true) interrupt=false
    howmuch = data.length
  console.log("gotobookmark2 howmuch", howmuch);
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

replaceNext = function(params){
  console.log("replace next ", params)
  nextsrt = compteur + 1
  var string = params
  var stringpropre = string.replace(/\_/g, ' ');
  var addobject = {text:stringpropre, type: "text"}
  data.splice(nextsrt, 0, params, [type="text"])

}

addCuppasButtons = function(){
  console.log("addCuppasButtons yo yo yo yo yo")
  newBoutton(["finishCuppa","c'est_bon_mon_thé_est_prêt","gotonext('1')", "destroy(id)"])
  $("#cuppasInc").remove()
  $("#sacbouttons").addClass("visible")
  $("#sacbouttons").removeClass("invisible")
}

finishCuppa = function(){
  console.log("finishCuppa!");
  var buchesArray = getSuperGlobal("buchesCount", []);
  var buchesAllumees = buchesArray.filter(function(buche){ return buche; }).length;
  console.log("finishCuppa?",buchesAllumees);
  if(buchesAllumees < 6) em.emit('salmFinishCuppa');

}

gotonext = function(params){
  var bonus = parseInt(params)
  compteur += bonus
  next()
  interrupt=false
  console.log("gotonext, ", params)
}

// m'ajouter à un pool de loterie
addUserToLottery = function(params){
  console.log('user?', Meteor.connection._lastSessionId, params);
  var lotteryName = params;
  if(lotteryName != "") {
    cookies.set(lotteryName, Meteor.connection._lastSessionId);
    em.setClient({ lotteryName: lotteryName, sessionId: Meteor.connection._lastSessionId });
    em.emit('salmAddMeToLottery');
  }

}
// unstop (si l'admin redonne le pouvoir au peuple)
unstop = function(params){
  interrupt = false;
}