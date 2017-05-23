// actions - fonctions pour le spectacle textes images questions/reponses etc...

// TO DO
// balises pour afficher du texte ailleurs que dans SRT (checklist, rubrique fiction)
// pour les variables globales, virer le var avant
// loadJSON = function(callback)
nextIsBlackPupitre = false
nextIsBlackAdmin = false

compteurquest = -1
compteur = -1
compteurPupitre = -1
// ça c'est pour commencer au 0 du tableau.
interrupt = false
indeximg = 0
alternance = false
autonextcontainer = null
nextBGcontainer = null
flipbookstatus = false
clock = null

areYouSureYouAreComfy = false

data = []
dataPupitre = []

// EST CE QU'IL FAUDRAIT PAS UN NEXT SPECIFIQUE POUR NLSAT? BEN OUIS EHEIN

nlSatNext = function(){
  if(undefined==dataPupitre[compteurPupitre]){
    console.log("tout va bien mais c'est fini, mais c'est ok c'est pas une erreur")
  }else{
    console.log('next', compteurPupitre, dataPupitre[compteurPupitre]);
    var currentData = dataPupitre[compteurPupitre]
    var type = currentData["type"]
    var params = currentData["text"]

    while(dataPupitre[compteurPupitre]["type"]!="text"){
        // tant que data[compteurPupitre] est une balise, ben continue à executer les instructions s'il te plaît
        
      if(Roles.userIsInRole(Meteor.user(), "admin")==true && Router.current().route.getName() == "admin"){
        console.log("un admin digne de ce nom ne fait pas d'actions en local")
      }else{
        action(type, params)
      }
      if((dataPupitre[compteurPupitre]["type"]!="text")||(dataPupitre[compteurPupitre]["text"]=="")){
        // euh alors ça je sais pas pourquoi ça marche mais ça permet d'éviter des situations où, arrivé à un bookmark
        // il sautait deux lignes au lieu d'une
        compteurPupitre+=1;
        nlSatNext();
      }
    }

    if((type=="text")&&($.isArray(params))){
      console.log("params ", params)
      $("#nlsrt").html("")
      for (var i = 0; i < params.length; i++) {
        for(k=balisesVue.length-1; k>=0 ; k--){
          console.log("balisesVue[k]", balisesVue[k])
          console.log("data[compteurPupitre].text", params)
          if(params[i].hasOwnProperty(balisesVue[k])) {
            if(Router.current().route.getName() != "videoproj"){
              if(TAPi18n.getLanguage().toUpperCase() == balisesVue[k].substr(0,2)){
                $("<div>"+params[i][balisesVue[k]]+"<br/</div>").appendTo("#nlsrt")
              }
            }else{
              // ça c'est parce que videoproj il doit afficher deux langues en même temps
                $("<div>"+params[i][balisesVue[k]]+"<br/></div>").appendTo("#nlsrt")
            }
          }
        }
      }
    }
    // TODO: NOIRS
        // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
        // bon ben c'est ici qu'il faudrait faire un truc
        
        // if(params=="***"){
        //   // ça c'est pour caler des blancs
        //   document.getElementById("srt").innerHTML = ""

        // }
    }
  }

  nlSatBack = function(){
  console.log('nlsatback', compteurPupitre, data[compteurPupitre]);
  var currentData = dataPupitre[compteurPupitre]
  var type = currentData["type"]
  var params = currentData["text"]

  while(dataPupitre[compteurPupitre]["type"]!="text"){
      // tant que data[compteurPupitre] est une balise, ben continue à executer les instructions s'il te plaît
      action(type, params)
      if((dataPupitre[compteurPupitre]["type"]!="text")||(data[compteurPupitre]["text"]=="")){
        // euh alors ça je sais pas pourquoi ça marche mais ça permet d'éviter des situations où, arrivé à un bookmark
        // il sautait deux lignes au lieu d'une
        compteurPupitre-=1;
        nlSatBack();
      }
    }

    if((type=="text")&&(params!="")){
      document.getElementById("nlsrt").innerHTML = params
      // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
      // bon ben c'est ici qu'il faudrait faire un truc
      if(params=="***"){
        // ça c'est pour caler des blancs
        document.getElementById("nlsrt").innerHTML = ""
      }
    }
  }



next = function(){
  if(undefined==data[compteur]){
    console.log("oulala je sais pas quoi faire avec cette balise ", data[compteur])
    console.log("ça c'est la suivante ", data[compteur+1])
  }else{
    console.log('next', compteur, data[compteur]);
    var currentData = data[compteur]
    var type = currentData["type"]
    var params = currentData["text"]

    while(data[compteur]["type"]!="text"){
        // tant que data[compteur] est une balise, ben continue à executer les instructions s'il te plaît
        
      if(Roles.userIsInRole(Meteor.user(), "admin")==true && Router.current().route.getName() == "admin"){
        console.log("un admin digne de ce nom ne fait pas d'actions en local")
      }else{
        console.log("ACTION de ", type, " avec params ", params)
        action(type, params)
      }
      if((data[compteur]["type"]!="text")||(data[compteur]["text"]=="")){
        // euh alors ça je sais pas pourquoi ça marche mais ça permet d'éviter des situations où, arrivé à un bookmark
        // il sautait deux lignes au lieu d'une
        compteur+=1;
        next();
      }
    }

    if((type=="text")&&($.isArray(params))){
      console.log("params ", params)
      $("#srt").html("")
      for (var i = 0; i < params.length; i++) {
        for(k=balisesVue.length-1; k>=0 ; k--){
          // console.log("balisesVue[k]", balisesVue[k])
          // console.log("data[compteur].text", params)
          if(params[i].hasOwnProperty(balisesVue[k])) {
            if(Router.current().route.getName() != "videoproj"){
              if(TAPi18n.getLanguage().toUpperCase() == balisesVue[k].substr(0,2)){
                $("<div>"+params[i][balisesVue[k]]+"</div>").appendTo("#srt")
              }
            }else{
              // ça c'est parce que videoproj il doit afficher deux langues en même temps
                $("<div>"+params[i][balisesVue[k]]+"</div>").appendTo("#srt")
            }
          }
        }
      }
    }
    // TODO: NOIRS
        // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
        // bon ben c'est ici qu'il faudrait faire un truc
        
        // if(params=="***"){
        //   // ça c'est pour caler des blancs
        //   document.getElementById("srt").innerHTML = ""

        // }
    }
  }

  back = function(){
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
        compteur-=1;
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

    case "removeclass":
    removeclass(params)
    break

    case "autonext":
    autonext(params)
    break

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

    case "fullscreen":
    fullscreen(params);
    break;
  }
}

sound = function(params){
  if(params=="start"){
    // em.emit('adminstartstream');
    console.log("jacky startTheStream??", streaming);
    // em.emit('salmstartstream');
    if(streaming) {
      var body = { "request": "watch", id: parseInt(1) };
      streaming.send({"message": body});
    }
      
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
      console.log("params du cue ", params, Router.current().route.getName())
    if(Roles.userIsInRole(Meteor.user(), "admin")==true && Router.current().route.getName() == "admin"){
      var string = params[0]
      var stringpropre = string.replace(/\_/g, ' ');
      alert("CUE DU CUE, ",stringpropre)
    }
}

// get_time_diff = function(datetime){
//   console.log("go GET TIME DIFF");
//   $("#srt").html("zoupla")
//   // euh alors y'a un bug de timezone là j'ai l'impression qu'il prend greenwitch
//   var datetime = typeof datetime !== 'undefined' ? datetime : "2017-01-21 21:29:99.000000"
//   var datetime = new Date(datetime).getTime();

//   console.log("datetime " + datetime)
//   var now = new Date().getTime();

//   if(isNaN(datetime)) return ""


//   if (datetime < now) {
//     var milisec_diff = now - datetime
//   }else{
//     var milisec_diff = datetime - now
//   }

//   var date_diff = new Date( milisec_diff )

//   var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24))
//   var hours = date_diff.getHours()
//   var minutes = date_diff.getMinutes()
//   var secondes = date_diff.getSeconds()

//   var difdif = ""
//   if(days>1) var difdif = difdif.concat(days.toString(), " jours et ")
//   if(days==1) var difdif = difdif.concat(days.toString(), " jour et ")
//   if(hours!=0) var difdif = difdif.concat(hours.toString(), ":")
//   if(minutes!=0) var difdif = difdif.concat(minutes.toString(), ":")

//   var difdif = difdif.concat(secondes.toString(), " <br> avant le début du spectacle à la maison.")

//   document.getElementById("srt").innerHTML = (difdif)

//   if (datetime-now <= -1) {
//    console.log("TOOT TOOT TOOT c'est l'heure du spectacle")
//    gotobookmark('spectacle')
//    clearInterval(clock)
//    interrupt=true
//    gotonext(1)
//   }

//   console.log("difdif " + difdif)
//   console.log("now " + now)
//   console.log("date_diff " + date_diff)
// }

changeImg = function(params){
  console.log('%c'+'src, '+params[1]+' transition '+params[0], 'background: #222; color: #bada55')

  chemin = params[1]
  transition = params[0]
  transitionms = transition * 1000

  if (chemin=="panic.png") {
    window.clearTimeout(nextBGcontainer)
  }

  $("#imgcontainerFRONT").css({
    WebkitTransition : 'opacity '+transition+'s ease-in-out',
    MozTransition    : 'opacity '+transition+'s ease-in-out',
    MsTransition     : 'opacity '+transition+'s ease-in-out',
    OTransition      : 'opacity '+transition+'s ease-in-out',
    transition       : 'opacity '+transition+'s ease-in-out'
  });

  $("#imgcontainerBACK").css({
    WebkitTransition : 'opacity 0.1s ease-in-out',
    MozTransition    : 'opacity 0.1s ease-in-out',
    MsTransition     : 'opacity 0.1s ease-in-out',
    OTransition      : 'opacity 0.1s ease-in-out',
    transition       : 'opacity 0.1s ease-in-out'
  });

  delaysecu0 = setTimeout(function(){
    $("#imgcontainerFRONT").css("background-image", "url(/img/"+chemin+".png");
  }, 50)

  delaysecu = setTimeout(function(){
    $("#imgcontainerFRONT").css("opacity", "1")
  }, 100)

  nextBGcontainer = setTimeout(function(){
    $("#imgcontainerBACK").css("background-image", "url(/img/"+chemin+".png"); 
    $("#imgcontainerFRONT").css({
      WebkitTransition : 'opacity 0.1s ease-in-out',
      MozTransition    : 'opacity 0.1s ease-in-out',
      MsTransition     : 'opacity 0.1s ease-in-out',
      OTransition      : 'opacity 0.1s ease-in-out',
      transition       : 'opacity 0.1s ease-in-out'
    });
    $("#imgcontainerFRONT").css("opacity", "0")
      console.log('%c TRANSITION DE '+ transitionms+ ' FINISHED.','background: #222; color: #bada55')
    },transitionms)
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

fullscreen = function(params){
  if(params=="on"){
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
  }else{
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozExitFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

destroy = function(self, replaceActual = "ok"){
  // FUNCTION DESTROY
  // dans l'idéal faudrait lui passer un délai également
  var delay = 333
  var element = document.getElementById(self)
  var parentid = element.parentNode.id

  var stringpropre = replaceActual.replace(/\_/g, ' ').replace(/\(/g, '\'');;

  $("#"+parentid).css("opacity","0")

  $("#srt").html(stringpropre)
  // SAM2
  // SI LE BOUTON EST DE TYPE CUPPAS FINISH_ALT (tu utilises l'id)
  // DANS CE CAS LÀ TU FAIS APPARAÎTRE UN TEXTE CUSTOM
  // ET DE NOUVEAU BOUTONS (LE VRAI CUPPAS FINISH)

  setTimeout(function(){
    $("#"+parentid).empty()
  },delay)
}

gotobookmarkPUPITRE = function(where){
  console.log("zorg ")
}

gotobookmark = function(where){
  console.log("gotobookmark1!!? where=", where);
  reculeur = 1
  if(where == "introseb"){
      reculeur = 3
  }

  if(typeof where !== 'string') where = where.toString();
  console.log("gotobookmark1b!!? where=", where);
  if(interrupt==true) interrupt=false
    howmuch = data.length
    console.log("gotobookmark2 howmuch", howmuch);
  for(i=0; i<howmuch; i++){
    if((data[i]["type"]=="bookmark")&&(data[i]["text"]==where)){
      //ça c'est la valeur de ton compteur mon ptit gars
      compteur = i-reculeur

      if(Roles.userIsInRole(Meteor.user(), "admin")==true){
        
        var modeSpectacle = getSuperGlobal("modeSpectacle");
        var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
        var compteurAdmin = getSuperGlobal("compteurAdmin");
        console.log("ACTIONS adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin", compteurAdmin);
        // if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurAdmin) != compteur) {
        if(modeSpectacle && parseInt(compteurAdmin) != compteur) {
          console.log("ACTIONS admin next compteur set compteurAdmin", compteur)
          // cookies.set('compteurAdmin', compteur);
          Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});
        }
      }
      setTimeout(function(){
        next()
        if(reculeur == 3){
          nextIsBlackAdmin = false
          $('#srt').html('')
        }
      },333)
      console.log("gotobookmark, ", compteur)
      return
    }
  }
}

replaceNext = function(params){
  console.log("replace next ", params)
  var nextsrt = compteur + 1
  var leReplace = {"text":" ", "type":"text"}

  if(params=="1"){
    leReplace.text = "Bon,tant pis. Par contre vous n’allez rien avoir pour vous abriter pendant l’orage."
  }

  if(params=="2"){
    leReplace.text = " "
  }

  if(params=="3"){
    leReplace.text = "Excellent."
  }

  if(params=="4"){
  leReplace.text = "Ok, si vous voyez les boutons apparaître, c'est à vous de répondre."
  }

  console.log("data next srt AVANT LIFTING ,",data[nextsrt])
  data.splice(nextsrt, 1, leReplace)
  console.log("data next srt APRé LIFTING ,",data[nextsrt])

}

addLotteryButtons = function(){
  console.log("addLotteryButtons yo yo yo yo yo")
  newBoutton(["iWantONH","Oui","addUserToLottery('oui-non-euh')", "destroy(id)"])
  newBoutton(["nonB","Non","replaceNext('2')", "destroy(id)"])
  $("#sacbouttons").addClass("visible")
  $("#sacbouttons").removeClass("invisible")

}

// SHOW BUTTONS READY!
// il faut qu'il cale un texte dans la div qui sinon est vide
// Quand vous avez fini vote cabane / installation, appuyez sur le bouton.
// LE BOUTON DIT : ça y est je suis installé.

// euh c'est un replaceNext() en fait

addCuppasButtons = function(){
  console.log("addCuppasButtons yo yo yo yo yo")
  newBoutton(["finishCuppa","OK_J\’AI_FINI_MA_CABANE", "finishCuppa(id)" ])
  $("#cuppasInc").remove()
  $("#sacbouttons").addClass("visible")
  $("#sacbouttons").removeClass("invisible")
}

finishCuppa = function(e){

  console.log("finishCuppa avant boucle");

  if (!areYouSureYouAreComfy) {
    areYouSureYouAreComfy=true
    $("#srt").html("Attendez, vous êtes sûr·e d\’être vraiment bien installé·e, bien bien confortablement ? Vous avez fait une vraie cabane ? Vous avez une boisson chaude ? Des coussins à foison ? <br/> Vous avez encore le temps de parfaire votre installation avant de confirmer que vous avez bien terminé.")
    $("#finishCuppa").attr('value', 'C\’EST BON CETTE FOIS JE ME SUIS VRAIMENT BIEN INSTALLÉ·E ET J\’AI MA BOISSON CHAUDE');
    // la mettre du CSS
    $("#srt").css("top", "-50%")
    $("#sacbouttons").css("margin-top","50px")
    //       $("#flipbookcontainer").css("display", "none")},1000)

    console.log("finishCuppa interieur boucle");

  }else{
    destroy(e)
    $("#srt").html("")

    $("#srt").css("top", "50%")
    $("#sacbouttons").css("margin-top","12px")

    console.log("finishCuppa apres boucle");

  var buchesArray = getSuperGlobal("buchesCount", []);
  var buchesAllumees = buchesArray.filter(function(buche){ return buche; }).length;
  console.log("finishCuppa?",buchesAllumees);
  if(buchesAllumees < 6){
   em.emit('salmFinishCuppa');
   // changeImgDeBuches(buchesAllumees)
  }
 }
}

// changeImgDeBuches= function(howmany){
//   src = "b-"+howmany
//   console.log("changeImgDeBuches ", src)
//   changeImg(["1",src])
// }

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