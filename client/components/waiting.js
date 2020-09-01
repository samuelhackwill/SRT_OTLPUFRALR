Session.setDefault('moreInfoClicked', false)
Session.setDefault('pastilleClicked', false)
var DetectRTC = require('detectrtc');


Template.registerHelper('formatDateLeFrenchStyle', function(date) {

  if (TAPi18n.getLanguage()=="fr") {
  // console.log("formatDateLeFrenchStyle?", date, date.getDate());
  // if(date.getDate() == "1")
  moment.locale("fr")
  return moment(date).format('dddd Do MMM YYYY [à] HH[h]mm');
}else{
  moment.locale("en")
  return moment(date).format('dddd Do MMM YYYY [at] HH[:]mm');
}
});

Template.waiting.onCreated(function() {

  console.log("SALUT C'EST DIEGO")

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allSuperGlobals')

    // console.log("how many secs remaining ", 60 - new Date().getSeconds())
    var firstInterval = 60 - new Date().getSeconds()

    Meteor.setTimeout(function() {
  // first interval
      Session.set("time", new Date());
      // console.log("first interval change time")

      Meteor.setInterval(function(){
        // all the next intervals yo
        Session.set("time", new Date())
        // console.log("all subsequent interval change time")
      }, 60000)
      // et voilà comme ça y'a pas besoin d'updater la date toutes les secondes! mais tu est un génie samuel
    }, firstInterval*1000);
    });

  DetectRTC.load(function() {
      // console.log("is web rtc supported? ", DetectRTC.isWebRTCSupported);
      // console.log(DetectRTC)

      if(DetectRTC.isWebRTCSupported==false){
        Meteor.setTimeout(function(){
          $('#stream-error').append(TAPi18n.__('bon_sang_de_bois'), "<a href='https://www.mozilla.org/en-US/firefox/new/'> FIREFOX </a>", TAPi18n.__('ou'), "<a href='https://www.google.com/chrome'> CHROME </a>", TAPi18n.__('revenez'))
        },1000)    
      }
  });
})

Template.waiting.onRendered(function () {
  // SPLASHSCREEN
  autonextcontainer = setTimeout(function(){
  document.getElementById("infotainment").style.opacity="1"
  document.getElementById("flag").style.opacity="1"
  },1000)


  currentLang = cookies.get("user_lan")
  allLang = TAPi18n.getLanguages()
  currentLangIndex = null


  if(currentLang){
    // console.log("found a cookie, looking for index now")
    TAPi18n.setLanguage(currentLang)
    for (var i=0; i<Object.keys(allLang).length; i++){
      // console.log("look for the lan index with lan ", currentLang)
      if(Object.keys(allLang)[i]==currentLang){
        // console.log("found the lan index! ", i)
        currentLangIndex = i
      }
    }
  }else{
        console.log("didn't find a cookie, asking the API")
    $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
    // console.log("COUNTRY IS ",data.countryCode)
    localCountry = data.countryCode
    // console.log("CITY IS ",data.city)
    // console.log("REGION NAME IS ",data.regionName)
    currentLang = localCountry.toLowerCase()
    cookies.set("user_lan", currentLang)
    TAPi18n.setLanguage(currentLang)

    for (var i=0; i<Object.keys(allLang).length; i++){
      // console.log("OK, thank you API, looking for the index now")
      // console.log("look for the lan index with lan ", currentLang)
      if(Object.keys(allLang)[i]==currentLang){
        // console.log("found the lan index! ", i)
        currentLangIndex = i
      }
    }
    })
  }

  if(currentLangIndex==null){
    // console.log("fuck this shit, couldn't find your country so i'm switching to english")
    currentLang = 'en'
    cookies.set("user_lan", currentLang)
    TAPi18n.setLanguage(currentLang)
    currentLangIndex = 0
  }

});


Template.waiting.events({

  'click #moreInfo' : function(){
    var isClicked = Session.get("moreInfoClicked")
    isClicked = !isClicked
    Session.set("moreInfoClicked", isClicked)
  },

  'click #flag' : function(){
    if(currentLangIndex < Object.keys(allLang).length-1){
      currentLangIndex += 1
      TAPi18n.setLanguage(Object.keys(allLang)[currentLangIndex])
    }else{
      currentLangIndex=0
      TAPi18n.setLanguage(Object.keys(allLang)[currentLangIndex])
    }
    cookies.set("user_lan", Object.keys(allLang)[currentLangIndex])

  },

  'click #pastille, touchstart #waiting': function(e){

    if(getSuperGlobal("modeSpectacle")){

      var checkCookie = cookies.get("get_me_in");

      if(null == checkCookie || undefined == checkCookie){
        now = new Date();
        // console.log("now ", now)
        nowHours = now.getHours()
        // console.log("nowHours ", nowHours)
        now.setHours(nowHours+5, 59, 59)
        // console.log("later ", now)
        // hum a voir si on va pas se faire bite in the ass par les fuseaux horaires
        // bon c'est mignon mais j'arrive pas à le récupérer le petit batard


        // document.cookie='get_me_in=true;expires='+now.toGMTString()+';path=/';

        cookies.set("get_me_in", true, {
        expires: now})

        Session.set('pastilleClicked', true)

        // console.log("new cookie");
      }else{
        // console.log("cookie already exists")
        return
      }

      // et là t'incrémentes le compteur de pélos qui on rejoint le spectac
      em.emit('incJoinedPool');



    }else{
      // console.log("no mode spectacle you're actualy not supposed to click thank you")
      return
    }
  }

});


Template.waiting.helpers({

  // la faut un helper pour la zone de texte 1 qui combine plusieurs trucs

  topFlyingText : function(){

    if (Session.get("time")){
      var reactiveTime = Session.get("time")
    }else{
      reactiveTime = new Date()
    }
    var reactiveHours = reactiveTime.getHours()
    var reactiveMinutes = reactiveTime.getMinutes()

    var now = new Date();
    var todayStart = new Date(now.setHours(0,0,0,0));

    var caca = representations.find({ 
        date_start: { 
          $gte: todayStart
        },
      "status": /(pending|running)/
    }, {sort: {date_start: 1}}).fetch()

    // console.log("the next show should start at ", caca[0].date_start.getHours()+":"+caca[0].date_start.getMinutes()+ " for salms at least")
    // console.log("the next show should start at ", caca[0].date_start.getHours()+":"+(caca[0].date_start.getMinutes()+17)+ " for people")

    if (reactiveMinutes<10) {
      reactiveMinutes = "0" + reactiveMinutes
    }
    var firstBit = TAPi18n.__('itsTime');

    if(reactiveHours <= caca[0].date_start.getHours() && reactiveMinutes <= caca[0].date_start.getMinutes()+17) {
      var secondBit = TAPi18n.__('venueOnTime');
      // console.log("you're on time bravo")
    }else{
      // la faut calculer la différence entre deux dates en minutes
      var diff = Math.abs(reactiveTime - caca[0].date_start);
      var minutes = Math.floor((diff/1000)/60);

      // console.log(" reactive time ", reactiveTime, " date start ", caca[0].date_start, " diff ", diff, " fancy math ", minutes)

      var secondBit = TAPi18n.__('venueUrLate') + " " + minutes + " minutes."
      // console.log("you're late batard!")

    }

    // console.log(firstBit + reactiveHours + ":" + reactiveMinutes +"." + secondBit)

    return firstBit+" "+reactiveHours+":"+reactiveMinutes+". " +secondBit+" "+firstBit+" "+reactiveHours+":"+reactiveMinutes+". " +secondBit+" "+firstBit+" "+reactiveHours+":"+reactiveMinutes+". " +secondBit
  },

  listRepresentations:function(){
    var now = new Date();
    var todayStart = new Date(now.setHours(0,0,0,0));
    var todayEnd = new Date(now.setHours(24,0,0,0));
    // console.log("listRepresentations??", representations.find().fetch());
    return representations.find({ 
        date_start: { 
          $gte: todayStart
        },
      "status": /(pending|running)/
    }, {sort: {date_start: 1}});
  },

  // DEPRECATED 

  // nextRepresentation:function(){
  //   var currentRepresentation = null;
  //   var now = new Date();
  //   var todayStart = new Date(now.setHours(0,0,0,0));
  //   var todayEnd = new Date(now.setHours(24,0,0,0));
  //   console.log("router checkPhone - today is between", todayStart, todayEnd);
  //   var foundRepresentation = representations.findOne({ 
  //     date_start: { 
  //       $gte: todayStart
  //     },
  //     "status": /(pending|running)/,
  //     "name": { $not: /STEALTH/ }
  //   }, {sort: {date_start: 1}});

  //   console.log("router checkPhone - representation?", foundRepresentation);
  //   if(foundRepresentation) { //representation du jour trouvée
  //     console.log("router checkPhone - representation du jour trouvée");
  //     theNextRepresentation = foundRepresentation;
  //     console.log("nextRepresentation=",theNextRepresentation);
  //     return theNextRepresentation
  //   }
  // },

  // DEPRECATED

  // chosenRepresentation:function(){

  //   var checkCookie = cookies.get("user_represent");
  //   console.log("chosenRepresentation - checkCookie?", checkCookie);
  //   if(checkCookie) {
  //     var chosenRepresentation = null;
  //     var foundRepresentation = representations.findOne({ 
  //       _id: checkCookie
  //     });

  //     console.log("chosenRepresentation - foundRepresentation?", foundRepresentation);
  //     if(foundRepresentation) { //representation du jour trouvée
  //       console.log("chosenRepresentation - representation choisie trouvée");
  //       chosenRepresentation = foundRepresentation;
  //       console.log("chosenRepresentation =", chosenRepresentation);
  //       return chosenRepresentation
  //     } else return null;
  //   } else return null;
  // },

  // DEPRECATED 

  // alreadyParticipating: function(){

  //   var checkCookie = cookies.get("user_represent");
  //   console.log('participating representation?', checkCookie, this._id);
  //   if(null != checkCookie && undefined != checkCookie && checkCookie == this._id) {
  //     return "alreadyParticipating";
  //   } else return "";
  // },

  // DEPRECATED

  // jeMinscris: function(date_start){

  //   var nowD = new Date().getDate()
  //   var nowM = new Date().getMonth() + 1 //sisi january = 0 sinon et ça rend triste
  //   var nowY = new Date().getFullYear()
  //   var nowH = new Date().getHours()
  //   var nowM = new Date().getMinutes()
    
  //   var dateD = date_start.getDate()
  //   var dateM = date_start.getMonth() + 1
  //   var dateY = date_start.getFullYear()
  //   var dateH = date_start.getHours()
  //   var dateM = date_start.getMinutes()

  //   var checkCookie = cookies.get("user_represent");
  //   console.log('participating representation?', checkCookie, this._id);
  //   modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;

  //   messageButtonOK = ""
  //   messageButton = ""
  //   // TODO implémenter anglais etc
  //   if (TAPi18n.getLanguage()=="fr"){
  //     messageButton = "Je m'inscris"
  //     messageButtonOK = "Inscription OK"
  //   }

  //   if (TAPi18n.getLanguage()=="nl"){
  //     messageButton = "Ik meld me aan"
  //     messageButtonOK = "Aanmelding geslaagd"
  //   }

  //   if (TAPi18n.getLanguage()=="en"){
  //     messageButton = "Register me"
  //     messageButtonOK = "Registration OK"
  //   }

  //   if (TAPi18n.getLanguage()=="de"){
  //     messageButton = "Anmelden"
  //     messageButtonOK = "Anmeldung OK"
  //   }


  //   if(null != checkCookie && undefined != checkCookie && checkCookie == this._id) {
  //     return messageButtonOK;
  //   } else return messageButton;
  // },

  clientHasClickedOnButton: function(){
    if(Session.get('moreInfoClicked')==true){
      // console.log("clientHasClickedOnButton true")
      return true
    }else{
      // console.log("clientHasClickedOnButton false")
      return false
    }
  },

  moreInfoClicked : function(){
    if (Session.get('moreInfoClicked')==false) {
      return TAPi18n.__('moreInfo')
      }else{
      return TAPi18n.__('lessInfo')
    }
  },

  isModeSpectacle: function(){
      modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
      // console.log("waiting - modeSpectacle??", modeSpectacle);
      // if(modeSpectacle) this.render('jacky');
      return modeSpectacle;
  },

  showTrigger: function(){
    if(getSuperGlobal("modeSpectacle")){
      return "1"
    }else{
      return "0"
    }
  },

  showTriggerBackground: function(){
    if(getSuperGlobal("modeSpectacle")){
      return "#221F2D";
    }else{
      return "white";
    }
  },
  
  isStealth: function(name){
    // console.log("NAME DE ISSTEALTH ", name)
    if(name == "STEALTH") return true;
    else return false;
  }
});

  $(document.body).on('keyup', function(e) {

    e = e || window.event
  // simulateur de nuit / jour


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    if(e.keyCode == '78'){
      setTimeout(function(){
      document.getElementById("LUMIERE").style.opacity="1"
      },4000)
      // document.getElementsByTagName("body")[1].style.backgroundColor="#221F2D"
      document.getElementById("waiting").style.backgroundColor="#221F2D"
    };    if(e.keyCode == '74'){
      document.getElementById("LUMIERE").style.opacity="0"
      // document.getElementsByTagName("body")[1].style.backgroundColor="white"
      document.getElementById("waiting").style.backgroundColor="white"
    };
    if(e.keyCode == '32'){

      em.emit('incJoinedPool');
    }


  });

