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
    $("#inscription").css("opacity", "1")
    $("#bonjour").css("opacity", "0")
  },1500)

    console.log("tu parles quel langue camarade? ", TAPi18n.getLanguage())
    TAPi18n.setLanguage("fr")
    console.log("et maintenant tu parles quel langue? ", TAPi18n.getLanguage())

    indexlang = 0;
    langtab = TAPi18n.getLanguages()
    howmanylang = Object.keys(langtab).length

});


Template.waiting.events({

  'click #flag' : function(){
    console.log(Object.keys(langtab)[indexlang])
    if (indexlang==howmanylang-1) {
        indexlang=0
    }else{
        indexlang+=1
    }
    TAPi18n.setLanguage(Object.keys(langtab)[indexlang])
    },

  'click .represent': function(e){
    $("#success").show()
    $("#success").css("opacity", ".97")

    console.log(e, 'choose represent!', this);
    e.stopPropagation();
    e.preventDefault();

    var loggedInUser = Meteor.user();
    console.log("loggedInUser", loggedInUser);

    var checkCookie = cookies.get("user_represent");

    if(null == checkCookie || undefined == checkCookie) {
      console.log("new user chose representation");
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
      messageButton = "ANMELDEN"
      messageButtonOK = "ANMELDUNG OK"
    }


    if(null != checkCookie && undefined != checkCookie && checkCookie == this._id) {
      return messageButtonOK;
    } else return messageButton;
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