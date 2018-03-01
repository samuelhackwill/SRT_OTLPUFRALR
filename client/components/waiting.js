Session.setDefault('moreInfoClicked', false)


Template.registerHelper('formatDateLeFrenchStyle', function(date) {
  console.log("formatDateLeFrenchStyle?", date, date.getDate());
  // if(date.getDate() == "1")
  return moment(date).format('dddd Do MMM YYYY à HH[h]mm');
});

Template.waiting.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
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
    console.log("found a cookie, looking for index now")
    TAPi18n.setLanguage(currentLang)
    for (var i=0; i<Object.keys(allLang).length; i++){
      console.log("look for the lan index with lan ", currentLang)
      if(Object.keys(allLang)[i]==currentLang){
        console.log("found the lan index! ", i)
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
      console.log("OK, thank you API, looking for the index now")
      console.log("look for the lan index with lan ", currentLang)
      if(Object.keys(allLang)[i]==currentLang){
        console.log("found the lan index! ", i)
        currentLangIndex = i
      }
    }
    })
  }

  if(currentLangIndex==null){
    console.log("fuck this shit, couldn't find your country so i'm switching to english")
    currentLang = 'en'
    cookies.set("user_lan", currentLang)
    TAPi18n.setLanguage(currentLang)
    currentLangIndex = 0
  }

  //hum faudrait peut être faire un truc au cas où le get JSON marche pas hein
  // pis régler cette histoire de laide redite


});


Template.waiting.events({
  
  'click #XMLID_8_' : function(){
    if (Session.get('moreInfoClicked')==false) {
      Session.set('moreInfoClicked', true)  
      document.getElementById("txt1").style.display = "none"
      document.getElementById("txt2").style.display = "initial"
    }else{
      Session.set('moreInfoClicked', false)  
      document.getElementById("txt2").style.display = "none"
      document.getElementById("txt1").style.display = "initial"
    }
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

  'click #pastille': function(e){
    $("#success").show()
    $("#success").css("opacity", ".97")

    // quand tu cliques sur la pastille en vrai faut juste chopper l'heure
    // pis tu fais mourrir le cookie allez, 3H plus tard max

    console.log(e, 'choose represent!', this);
    e.stopPropagation();
    e.preventDefault();

    var loggedInUser = Meteor.user();
    console.log("loggedInUser", loggedInUser);

    var checkCookie = cookies.get("user_represent");

    if(null == checkCookie || undefined == checkCookie) {
      console.log("new cookie");
      var args = {
        _id: this._id
      };
      
      if(loggedInUser) args.userId = loggedInUser._id;
        console.log('representation : ', args);
        Meteor.call('addUserToRepresentation', args);
        cookies.set("user_represent", this._id);
      } else if(checkCookie != this._id) {
       
        console.log("already user change representation");

        var args = {
          _id: this._id,
          old_representation: checkCookie
        };
        if(loggedInUser) args.userId = loggedInUser._id;
          console.log('representation : ', args);
          Meteor.call('addUserToRepresentation', args);
          cookies.set("user_represent", this._id);
        } else {
          console.log("already chosen this", cookies.get("user_represent"));
        }

        $("#date_choisie").html(moment(this.date_start).format('dddd Do MMM YYYY à HH[h]mm'))
        $("#warning").html("<br />") 
  }
});


Template.waiting.helpers({
  listRepresentations:function(){
    var now = new Date();
    var todayStart = new Date(now.setHours(0,0,0,0));
    var todayEnd = new Date(now.setHours(24,0,0,0));
    console.log("listRepresentations??", representations.find().fetch());
    return representations.find({ 
        date_start: { 
          $gte: todayStart
        },
      "status": /(pending|running)/
    }, {sort: {date_start: 1}});
  },
  nextRepresentation:function(){
    var currentRepresentation = null;
    var now = new Date();
    var todayStart = new Date(now.setHours(0,0,0,0));
    var todayEnd = new Date(now.setHours(24,0,0,0));
    console.log("router checkPhone - today is between", todayStart, todayEnd);
    var foundRepresentation = representations.findOne({ 
      date_start: { 
        $gte: todayStart
      },
      "status": /(pending|running)/,
      "name": { $not: /STEALTH/ }
    }, {sort: {date_start: 1}});

    console.log("router checkPhone - representation?", foundRepresentation);
    if(foundRepresentation) { //representation du jour trouvée
      console.log("router checkPhone - representation du jour trouvée");
      theNextRepresentation = foundRepresentation;
      console.log("nextRepresentation=",theNextRepresentation);
      return theNextRepresentation
    }
  },
  chosenRepresentation:function(){

    var checkCookie = cookies.get("user_represent");
    console.log("chosenRepresentation - checkCookie?", checkCookie);
    if(checkCookie) {
      var chosenRepresentation = null;
      var foundRepresentation = representations.findOne({ 
        _id: checkCookie
      });

      console.log("chosenRepresentation - foundRepresentation?", foundRepresentation);
      if(foundRepresentation) { //representation du jour trouvée
        console.log("chosenRepresentation - representation choisie trouvée");
        chosenRepresentation = foundRepresentation;
        console.log("chosenRepresentation =", chosenRepresentation);
        return chosenRepresentation
      } else return null;
    } else return null;
  },

  alreadyParticipating: function(){

    var checkCookie = cookies.get("user_represent");
    console.log('participating representation?', checkCookie, this._id);
    if(null != checkCookie && undefined != checkCookie && checkCookie == this._id) {
      return "alreadyParticipating";
    } else return "";
    // si tu participes déjà tu retrun le nom de la classe, sinon non
  },

  jeMinscris: function(date_start){
    var nowD = new Date().getDate()
    var nowM = new Date().getMonth() + 1 //sisi january = 0 sinon et ça rend triste
    var nowY = new Date().getFullYear()
    var nowH = new Date().getHours()
    var nowM = new Date().getMinutes()
    
    var dateD = date_start.getDate()
    var dateM = date_start.getMonth() + 1
    var dateY = date_start.getFullYear()
    var dateH = date_start.getHours()
    var dateM = date_start.getMinutes()

    var checkCookie = cookies.get("user_represent");
    console.log('participating representation?', checkCookie, this._id);
    modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;

    messageButtonOK = ""
    messageButton = ""
    // TODO implémenter anglais etc
    if (TAPi18n.getLanguage()=="fr"){
      messageButton = "Je m'inscris"
      messageButtonOK = "Inscription OK"
    }

    if (TAPi18n.getLanguage()=="nl"){
      messageButton = "Ik meld me aan"
      messageButtonOK = "Aanmelding geslaagd"
    }

    if (TAPi18n.getLanguage()=="en"){
      messageButton = "Register me"
      messageButtonOK = "Registration OK"
    }

    if (TAPi18n.getLanguage()=="de"){
      messageButton = "Anmelden"
      messageButtonOK = "Anmeldung OK"
    }


    if(null != checkCookie && undefined != checkCookie && checkCookie == this._id) {
      return messageButtonOK;
    } else return messageButton;
  },

  clientHasClickedOnButton: function(){
    if(Session.get('moreInfoClicked')==true){
      console.log("clientHasClickedOnButton true")
      return true
    }else{
      console.log("clientHasClickedOnButton false")
      return false
    }
  },

  isModeSpectacle: function(){
      modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
      console.log("waiting - modeSpectacle??", modeSpectacle);
      // if(modeSpectacle) this.render('jacky');
      return modeSpectacle;
  },
  
  isStealth: function(name){
    console.log("NAME DE ISSTEALTH ", name)
    if(name == "STEALTH") return true;
    else return false;
  }
});

  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    if(e.keyCode == '78'){
      document.getElementById("peloDay").style.opacity="0"
      document.getElementById("peloNight").style.opacity="1"
      document.body.style.backgroundColor="#221F2D"
    };    if(e.keyCode == '74'){
      document.getElementById("peloDay").style.opacity="1"
      document.getElementById("peloNight").style.opacity="0"
      document.body.style.backgroundColor="white"
    };
  });
