nextIsBlackPupitre = false
nextIsBlackAdmin = false

compteur = 0
compteurPupitre = -1

interrupt = false

alternance = false

autonextcontainer = null
nextBGcontainer = null

areYouSureYouAreComfy = false

data = []
dataPupitre = []

nlSatNext = function(){
  if(undefined==dataPupitre[compteurPupitre]){
    console.log("tout va bien mais c'est fini, mais c'est ok c'est pas une erreur")
  }else{
    // console.log('next', compteurPupitre, dataPupitre[compteurPupitre]);
    var currentData = dataPupitre[compteurPupitre]
    var type = currentData["type"]
    var params = currentData["text"]

    while(dataPupitre[compteurPupitre]["type"]!="text"){
        // tant que data[compteurPupitre] est une balise, ben continue à executer les instructions s'il te plaît
        
      if(Roles.userIsInRole(Meteor.user(), "admin")==true && Router.current().route.getName() == "admin"){
        // console.log("un admin digne de ce nom ne fait pas d'actions en local")
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
      // console.log("params ", params)
      $("#nlsrt").html("")
      for (var i = 0; i < params.length; i++) {
        for(k=balisesVue.length-1; k>=0 ; k--){
          // console.log("balisesVue[k]", balisesVue[k])
          // console.log("data[compteurPupitre].text", params)
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
  }
}

nlSatBack = function(){
  // console.log('nlsatback', compteurPupitre, data[compteurPupitre]);
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
    // console.log("oulala je sais pas quoi faire avec cette balise ", data[compteur])
    // console.log("ça c'est la suivante ", data[compteur+1])
  }else{
    // console.log('next', compteur, data[compteur]);
    var currentData = data[compteur]
    var type = currentData["type"]
    var params = currentData["text"]

    while(data[compteur]["type"]!="text"){
        // tant que data[compteur] est une balise, ben continue à executer les instructions s'il te plaît
        
      if(Roles.userIsInRole(Meteor.user(), "admin")==true && Router.current().route.getName() == "admin"){
        // console.log("un admin digne de ce nom ne fait pas d'actions en local")
      }else{
        // console.log("ACTION de ", type, " avec params ", params)
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


// VERSION BILINGUE
      for (var i = 0; i < params.length; i++) {
        for(k=balisesVue.length-1; k>=0 ; k--){
          console.log("balisesVue[k]", balisesVue[k])
          console.log("data[compteur].text", params)
          if(params[i].hasOwnProperty(balisesVue[k])) {
            

            if(Router.current().route.getName() != "videoproj"){
              if(TAPi18n.getLanguage().toUpperCase() == balisesVue[k].substr(0,2)){
                $("<div>"+params[i][balisesVue[k]]+"</div>").appendTo("#srt")
              }
            }else{
              // VERSION BILINGUE
                $("<div>"+params[i][balisesVue[k]]+"</div>").appendTo("#srt")
              // VERSION FR
               // $("#srt").html(params[i]["FR_CYCLO"])
            }
          }
        }
      }
    }
  }
}

back = function(){
  // console.log('next', compteur, data[compteur]);
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
    // document.getElementById("srt").innerHTML = params
    // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
    // bon ben c'est ici qu'il faudrait faire un truc
    if(params=="***"){
      // ça c'est pour caler des blancs
      // document.getElementById("srt").innerHTML = ""
    }
  }
}

action = function(type, params){
  switch(type){
    // case "cue":
    // cue(params)
    // break

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
    // version nicecast global fuckup de l'enfer clermont 10/18

    // audio = document.getElementById('player')
    // audio.play()



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

// cue = function(params){
//       console.log("params du cue ", params, Router.current().route.getName())
//     if(Roles.userIsInRole(Meteor.user(), "admin")==true && Router.current().route.getName() == "admin"){
//       var string = params[0]
//       var stringpropre = string.replace(/\ /g, ' ');
//       alert("CUE DU CUE, ",stringpropre)
//     }
// }


changeImg = function(params){
  console.log('%c'+'src, '+params[1]+' transition '+params[0], 'background: #222; color: #bada55')

  chemin = params[1]
  transition = params[0]
  transitionms = transition * 1000

  if (chemin=="panic.png") {
    // si tu appelles le fond d'écran qui s'appelle panic.png ça clear toutes les transitions en cours
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

  // console.log("DÉBUT autonext "+wait)
  autonextcontainer = setTimeout(function(){
    gotonext(1)
    // console.log("FIN autonext ")
  },wait)
}

addclass = function(params){
  // console.log("addclass, ", params[0], params[1])
  $("#"+params[0]).addClass(params[1])
}

removeclass = function(params){
  // console.log("removeclass, ", params[0], params[1])
  $("#"+params[0]).removeClass(params[1])
}

newBoutton = function(params){
  interrupt=true

  var fonctions = []
  var nom = params[0]
  params.shift()
  var label = params[0]
  var labelpropre = label.replace(/\ /g, ' ');

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
  if(Router.current().route.getName() != "pupitre"){
    if(params=="on"){
      var i = document.body;
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
}

destroy = function(self, replaceActual = ""){
  // dans l'idéal faudrait lui passer un délai également
  var delay = 333
  var element = document.getElementById(self)
  var parentid = element.parentNode.id

  $("#"+parentid).css("opacity","0")

  setTimeout(function(){
    $("#"+parentid).empty()
  },delay)
}

gotobookmarkPUPITRE = function(where){
  console.log("to do! ")
  // TODO
  // implémenter les bails pour que le pupitre puisse aussi faire un compteur change
  // note circa 2010
}

gotobookmark = function(where){
  // console.log("gotobookmark1!!? where=", where);
  reculeur = 1
  if(where == "introseb"){
    // ?
      reculeur = 3
  }

  if(typeof where !== 'string') where = where.toString();
  // console.log("gotobookmark1b!!? where=", where);
  if(interrupt==true) interrupt=false
    howmuch = data.length
    // console.log("gotobookmark2 howmuch", howmuch);
  for(i=0; i<howmuch; i++){
    if((data[i]["type"]=="bookmark")&&(data[i]["text"]==where)){
      //ça c'est la valeur de ton compteur mon ptit gars
      compteur = i-reculeur

      if(Roles.userIsInRole(Meteor.user(), "admin")==true){
        
        var modeSpectacle = getSuperGlobal("modeSpectacle");
        var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
        var compteurAdmin = getSuperGlobal("compteurAdmin");
        // console.log("ACTIONS adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin", compteurAdmin);
        if(modeSpectacle && parseInt(compteurAdmin) != compteur) {
          // console.log("ACTIONS admin next compteur set compteurAdmin", compteur)
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
      // console.log("gotobookmark, ", compteur)
      return
    }
  }
}

replaceNext = function(params){
  // est ce que ça sert encore ça?
  // console.log("replace next ", params)
  var nextsrt = compteur + 1
  var leReplace = {"text":" ", "type":"text"}

  if(params=="1"){
    leReplace.text = ""
  }

  if(params=="2"){
    leReplace.text = ""
  }

  if(params=="3"){
    leReplace.text = ""
  }

  if(params=="4"){
  leReplace.text = ""
  }

  // console.log("data next srt AVANT LIFTING ,",data[nextsrt])
  data.splice(nextsrt, 1, leReplace)
  // console.log("data next srt APRé LIFTING ,",data[nextsrt])

}

addLotteryButtons = function(){
  switch(TAPi18n.getLanguage()){
    // TODO implémenter anglais etc
    case "fr" :
      newBoutton(["iWantONH","Oui","addUserToLottery('oui-non-euh')","destroy(id)"])
      newBoutton(["nonB","Non","destroy(id)"])
      break

    case "nl" :
      newBoutton(["iWantONH","Ja","addUserToLottery('oui-non-euh')","destroy(id)"])
      newBoutton(["nonB","Nee","destroy(id)"])
      break

    case "en" :
      newBoutton(["iWantONH","Yes","addUserToLottery('oui-non-euh')","destroy(id)"])
      newBoutton(["nonB","No","destroy(id)"])
      break
    
    case "de" :
      newBoutton(["iWantONH","Ja","addUserToLottery('oui-non-euh')","destroy(id)"])
      newBoutton(["nonB","Nein","destroy(id)"])
      break

  }
  $("#sacbouttons").addClass("visible")
  $("#sacbouttons").removeClass("invisible")
}

addCuppasButtons = function(){
  switch(TAPi18n.getLanguage()){
    // IDEM
    case "fr":
      newBoutton(["finishCuppa","OK J\’AI FINI MA CABANE", "finishCuppa(id)" ])
    break

    case "nl":
      newBoutton(["finishCuppa","OK IK BEN KLAAR MET MIJN HUT", "finishCuppa(id)" ])
    break

    case "en":
      newBoutton(["finishCuppa","OK, I\’VE FINISHED MY HUT", "finishCuppa(id)" ])
    break

    case "de":
      newBoutton(["finishCuppa","OK MEINE HÜTTE IST FERTIG", "finishCuppa(id)" ])
    break
  }
  $("#cuppasInc").remove()
  $("#sacbouttons").addClass("visible")
  $("#sacbouttons").removeClass("invisible")
}

finishCuppa = function(e){

  //TODO hé ho il serait temps que les buches s'allument toutes seules nan? regarder dans l'admin ça le fait déjà

  console.log("finishCuppa avant boucle");

  if (!areYouSureYouAreComfy) {
    areYouSureYouAreComfy=true
    switch(TAPi18n.getLanguage()){
      case "fr":
        $("#srt").html("Attendez, vous êtes sûr·e d\’être vraiment bien installé·e, bien bien confortablement ? Vous avez fait une vraie cabane ? Vous avez une boisson chaude ? Des coussins à foison ? <br/> Vous avez encore le temps de parfaire votre installation avant de confirmer que vous avez bien terminé.")
        $("#finishCuppa").attr('value', 'C\’EST BON CETTE FOIS JE ME SUIS VRAIMENT BIEN INSTALLÉ·E ET J\’AI MA BOISSON CHAUDE');
      break

      case "nl":
        $("#srt").html("Wacht\, ben je zeker dat je goed geïnstalleerd bent\, lekker comfortabel \? Je hebt een echte hut gemaakt \? Je hebt een warme drank \? Lekker veel kussens \? <br/> Je hebt namelijk nog de tijd om alles op punt te stellen vooraleer je bevestigd dat je klaar bent.")
        $("#finishCuppa").attr('value', 'OK\, DEZE KEER BEN IK GOED GEÏNSTALLEERD EN IK HEB MIJN WARME DRANK.');
      break

      case "en":
        $("#srt").html("Wait\, are you sure you\’re really all set\, very comfortably installed\? Have you made a real hut\? Do you have a hot drink\? Lots of cushions\? <br/> You still have time to perfect your installation before confirming that you’ve well and truly finished.")
        $("#finishCuppa").attr('value', 'RIGHTO\, THIS TIME I\’VE REALLY SETTLED IN COMFORTABLY WITH MY HOT DRINK');
      break


      case "de":
        $("#srt").html("Moment\. Sind Sie sicher\, dass Sie es wirklich gemütlich haben\? So richtig kuschelig \? Haben Sie eine Hütte gebaut \? Haben Sie ein Heißgetränk \? Ganz viele Kissen \? <br/> Sie haben noch Zeit\. Sie können Ihr kleines Bauwerk vervollkommnen\, bevor Sie bestätigen\, dass Sie fertig sind\.")
        $("#finishCuppa").attr('value', 'OK JETZT IST ES HIER RICHTIG GEMÜTLICH UND DAS HEISSGETRÄNK HABE ICH AUCH.');
      break

  }
    $("#srt").css("top", "-50%")
    $("#sacbouttons").css("margin-top","180px")

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
  }
 }
}


gotonext = function(params){
  var bonus = parseInt(params)
  compteur += bonus
  next()
  interrupt=false
  // console.log("gotonext, ", params)
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