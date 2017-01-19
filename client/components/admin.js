
Template.admin.onCreated(function() {
  console.log('Template admin created.');
  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('allSuperGlobals');
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
  });

});

Template.showtime.onRendered(function () {
});
Template.admin.onRendered(function () {
  console.log('admin!');
  console.log(UserStatus);
  console.log(this.UserConnections);

  Meteor.subscribe('userStatus');
  Meteor.subscribe('allPhoneNumbers');

  this.autorun(() => {
    console.log("showtime autorun admin", Template.instance());
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("showtime contnus", contnus, data);
    data = ContenusEcran.findOne({name: "text-spectacle"}).data
    console.log('showtime data ?', data);
    console.log('showtime ContenusEcran ?', ContenusEcran.find().fetch());
    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    console.log("showtime isItPowerToThePeople", isItPowerToThePeople);
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
  });
/*
  Polls.after.update(function (userId, doc, fieldNames, modifier, options) {
    em.emit('hi', userId, doc, fieldNames, modifier, options);
    console.log('after update', userId, doc, fieldNames, modifier, options);
  }, {fetchPrevious: false});
  
  */
  console.log('em', em);
  em.addListener('salmreponseoui', function(what) {
    console.log('salm oui!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    var son = new Audio('oui.ogg');
    son.addEventListener('playing', function(){
      console.log('oui playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    });
    son.play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 
  em.addListener('salmreponsenon', function(what) {
    console.log('salm non!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    var son = new Audio('non.ogg');
    son.addEventListener('playing', function(){
      console.log('non playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    });
    son.play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 
  em.addListener('salmreponseeuh', function(what) {
    console.log('salm euh!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    var son = new Audio('euuuh.ogg');
    son.addEventListener('playing', function(){
      console.log('euuuh playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    });
    son.play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 


  em.addListener('adminnext', function(what) {
    console.log('admin next!', what);
    var son = new Audio('euuuh.ogg').play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 



  em.addListener('adminSUPERinterrupt', function(what) {
    console.log('admin SUPER interrupt!', what);
    console.log('changer le mode SUPERinterrupt');
    Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: what});
    // var son = new Audio('euuuh.ogg').play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 


  //prendre le pouvoir
  //transformer en joli switch
  $('input#josebove').bootstrapSwitch();
  $('input#josebove').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('jose bové ftw!');
    // event.preventDefault();
    console.log('prendre le pouvoir? ', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'powerToThePeople', value: !data});
    //em.emit('adminswitchthepower');
  });
  //activer le mode spectacle
  //transformer en joli switch
  $('input#showmode').bootstrapSwitch();
  $('input#showmode').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('showmode ftw!');
    // event.preventDefault();
    console.log('activer le mode spectacle? ', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'modeSpectacle', value: data});
    em.emit('adminrefreshpage');
  });
  //activer le mode SUPERinterrupt
  //transformer en joli switch
  $('input#SUPERinterruptMode').bootstrapSwitch();
  // $('input#SUPERinterruptMode').on('switchChange.bootstrapSwitch', function (event, data) {
  //   console.log('SUPERinterruptMode ftw!');
  //   // event.preventDefault();
  //   console.log('activer le mode SUPERinterrupt', data, $(this).val());
  //   Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: data});
  //   // em.emit('adminrefreshpage');
  // });


  // TO DO

  // cookie quand quelqu'un arrive au bout
  // attention y'a un bug avec les boutons que j'ai pseudo-rêglé en empêchant les mouseevents quand le compteur =! x ou y

  function next(){
    // console.log('next', compteur);
    // if(compteur >= 75) compteur = 75;
    var currentSub = data[compteur]
    document.getElementById("srt").innerHTML = currentSub
    // ça c'est pour virer le focus des boutons oui et non histoire de pas les activer en appuyant sur espace
    // Session.update("compteur", compteur);
    em.setClient({ compteur: compteur });
    em.emit('adminnext');
  }

  document.onkeydown = function(e) {

    e = e || window.event
    /*
    pour revenir en arrière
      if(e.keyCode =='37' && compteur > 0){
        compteur -=1
        next();
      }
      */

    //  KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"

    if(e.keyCode =='32' && compteur < Object.keys(data).length-1){
      compteur +=1
      next();
    }

    //CUES

    // ptin on pourrait faire comment pour override les fonctions avec du délai si le client appuie une première fois sur espace 
    // genre neuneu = false

    /*
    if(compteur==5){
      toggle = false;
      document.getElementById("pagu").style.cursor = "pointer"
    }
    */
  }

});

Template.admin.helpers({
  usersOnline:function(){
    return Meteor.users.find();
  },
  usersOnlineCount:function(){
   //event a count of users online too.
   return Meteor.users.find().count();
  }
});

Template.showtime.helpers({
  isPowerToTheAdminChecked:function(){
    var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    console.log("isPowerToTheAdminChecked", !powerToThePeople);
    return !powerToThePeople;
  },
  isSUPERinterruptChecked:function(){
    var modeSUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}}).SUPERinterrupt;
    console.log("isSUPERinterruptChecked", modeSUPERinterrupt);
    return modeSUPERinterrupt;
  },
  isModeSpectacleChecked:function(){
    var modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
    console.log("isModeSpectacleChecked", modeSpectacle);
    return modeSpectacle;
  },
  usersOnlineCount:function(){
   //event a count of users online too.
   return Meteor.users.find().count();
  },
  cuppasCount:function(){
    var cuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}}).cuppasCount
   return cuppasCount;
  }
});

Template.phonesList.helpers({
  listPhoneNumbers:function(){
    console.log("PhoneNumbers??");
    return PhoneNumbers.find({}, {sort: {updated: -1}});
  },
  phoneNumbersCount:function(){
   //event a count of users online too.
   return PhoneNumbers.find().count();
  },
  quickRemoveButtonOnError: function () {
    return function (error) { alert("BOO!"); console.log(error); };
  },
  quickRemoveButtonOnSuccess: function () {
    return function (result) { alert("YAY!"); console.log(result); };
  },
  quickRemoveButtonBeforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.number + '"?')) {
        this.remove();
      }
    };
  }
});

Template.showtime.events({

  'click #resetCuppas': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'cuppasReset'});
  },

  'click #start-the-stream': function(){
    // console.log('superGlobals streamStarted', Meteor);
    // Meteor.call('startTheStream', function(result){
    //   console.log(result);
    // });
    // em.setClient({ compteur: compteur });
    em.emit('adminstartstream');
    console.log('adminstartstream emmited');
  },
  'click #show-the-ONE': function(){
      em.emit('adminshowtheone');
  },
  'click #hide-the-ONE': function(){
      em.emit('adminhidetheone');
  }

});