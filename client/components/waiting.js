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

  'click a.represent': function(e){
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
        $gte: todayStart,
        $lt: todayEnd
      },
      "status": /(pending|running)/
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
      return " alreadyParticipating";
    } else return "";
  },
  isModeSpectacle: function(){
      // modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
      console.log("waiting - modeSpectacle??", modeSpectacle);
      // if(modeSpectacle) this.render('jacky');
      return modeSpectacle;
  }
});