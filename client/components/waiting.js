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


    console.log("splash")

    autonextcontainer = setTimeout(function(){
    $("#inscription").css("opacity", "1")
    $("#bonjour").css("opacity", "0")
     },1500)


    console.log("waiting", new Date());
/*
    this.autorun(() => {
      console.log("waiting autorun", Template.instance());
      let ready = Template.instance().subscriptionsReady();
      if (!ready){ return; }
      let representationz = representations.find().fetch();
      console.log("representationz", representationz);
      // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
      // console.log('srt spectacle rendered');
      // console.log('data ?', data);
      // console.log('ContenusEcran ?', ContenusEcran.find().fetch());
      // var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
      // console.log("isItPowerToThePeople", isItPowerToThePeople);
      // rawTextToJson();
    // console.log(Template.instance());
      // zoupageJSON(dataFromDB, data);
      // autonext(2000);
    });*/
  });


Template.waiting.events({

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

    if (this.name=="Répétition générale") {
      $("#warning").html("(notez bien que la date que vous avez choisi est une répétition générale.)")
}else{
      $("#warning").html("<br />")
  }
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
          // ,
          // $lt: todayEnd
        },
      "status": /(pending|running)/
    }, {sort: {date_start: 1}});
  },
  nextRepresentation:function(){
    //var now = new Date('2017-03-02T00:00:00.000Z');
    var currentRepresentation = null;
    // modeSpectacle = getSuperGlobal("modeSpectacle");
    // if(modeSpectacle) { //le spectacle va bientôt commencer ou a déjà commencé
      //récupérons la representation du jour
    var now = new Date();
    // var yesterday = new Date();
    // yesterday.setDate(now.getDate() - 1);
    // console.log("NOW ", now)
    // console.log("YESTERDAY ",yesterday)
    var todayStart = new Date(now.setHours(0,0,0,0));
    var todayEnd = new Date(now.setHours(24,0,0,0));
    console.log("router checkPhone - today is between", todayStart, todayEnd);
    var foundRepresentation = representations.findOne({ 
      date_start: { 
        $gte: todayStart
        // $lt: todayEnd
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
// <<<<<<< HEAD

// =======
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
// >>>>>>> da32dacf5a3c9a7a1090c7f3f7d38e41ae73f5bf
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


    // console.log("LA DATE ", dateD, dateM, dateY)
    // console.log("AJD ", nowD, nowM, nowY)

    var checkCookie = cookies.get("user_represent");
    console.log('participating representation?', checkCookie, this._id);
      modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
    // if(modeSpectacle && nowD == dateD && nowM == dateM && nowY == dateY && nowH >= dateH && nowM >= dateM){
    //   return("Représentation en cours!")
    // }

    messageButtonOK = ""
    messageButton = ""
    if (TAPi18n.getLanguage()=="fr"){
      messageButton = "Je m'inscris"
      messageButtonOK = "Inscription OK"
    }

    if (TAPi18n.getLanguage()=="nl"){
      messageButton = "Ik meld me aan"
      messageButtonOK = "Aanmelding geslaagd"
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