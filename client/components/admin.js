Template.registerHelper('equals', function (a, b) {
  return a == b;
});

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
  
  $(document.body).addClass('admin');
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
    data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
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
    console.log('changer le mode SUPERinterrupt NOT USED RIGHT NOW');
    // Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: what.value});
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

    var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    console.log("le pouvoir 1 ?", powerToThePeople);
    var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    console.log("le pouvoir 1 ?", isPowerToThePeople);
    Meteor.call('setSuperGlobal', {name: 'powerToThePeople', value: !data});

    var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    console.log("le pouvoir 2 ?", powerToThePeople);
    var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    console.log("le pouvoir 2 ?", isPowerToThePeople);

    em.setClient({ powerToThePeople: !data });
    em.emit('adminswitchthepower');
    if(data == true) { //power admin
      // em.setClient({ bookmark: 'spectacle' });
      // em.emit('adminForceGoTo');
      // gotobookmark('spectacle');
    } else if(data == false) { //power retourne aux SALM
      // em.setClient({ bookmark: 'fin-spectacle' });
      // em.emit('adminForceGoTo');
    }
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
  //démarrer le spectacle
  //transformer en joli switch
  $('input#startSpectacle').bootstrapSwitch();
  $('input#startSpectacle').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('startSpectacle ftw!');
    // event.preventDefault();
    console.log('démarrer le spectacle? ', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'spectacleStarted', value: data});
    // em.emit('adminrefreshpage');
  });
  //activer le mode SUPERinterrupt
  //transformer en joli switch
  $('input#SUPERinterrupt').bootstrapSwitch();
  $('input#SUPERinterruptMode').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('SUPERinterruptMode ftw!');
    // event.preventDefault();
    console.log('activer le mode SUPERinterrupt', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: data});
    // em.emit('adminrefreshpage');
  });


  // TO DO

  // cookie quand quelqu'un arrive au bout
  // attention y'a un bug avec les boutons que j'ai pseudo-rêglé en empêchant les mouseevents quand le compteur =! x ou y

  function adminNext(){
    // console.log('next', compteur);
    // if(compteur >= 75) compteur = 75;

    // var currentSub = data[compteur]
    // document.getElementById("srt").innerHTML = currentSub

    // if((type=="text")&&(params!="")){
    //   document.getElementById("srt").innerHTML = params
    //   // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
    //   // bon ben c'est ici qu'il faudrait faire un truc
    //   if(params=="***"){
    //     // ça c'est pour caler des blancs
    //     document.getElementById("srt").innerHTML = ""
    //   }
    // }
    // ça c'est pour virer le focus des boutons oui et non histoire de pas les activer en appuyant sur espace
    // Session.update("compteur", compteur);
    // if(compteur < data.length-1){
      window.clearTimeout(autonextcontainer)
      compteur +=1
      next();
      em.setClient({ compteur: compteur });
      em.emit('adminnext');
    // }
  }

  document.onkeyup = function(e) {

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

    
    if(e.keyCode =='78' && compteur < data.length-1){
      // window.clearTimeout(autonextcontainer)
      // compteur +=1
      adminNext();
      console.log("keyup, ", compteur)
      // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
      // ça avance tout seul avec un délai)
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
    var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    console.log("isPowerToTheAdminChecked", !isPowerToThePeople);
    return !isPowerToThePeople;
  },
  whoIsSUPERinterrupted:function(){
    var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : [];
    console.log("isSUPERinterruptChecked", isSUPERinterrupt);
    return isSUPERinterrupt;
  },
  isModeSpectacleChecked:function(){
    var modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}});
    var isModeSpectacle = (modeSpectacle) ? modeSpectacle.modeSpectacle : false;
    console.log("isModeSpectacleChecked", isModeSpectacle);
    return isModeSpectacle;
  },
  isTheShowStarted:function(){
    var spectacleStarted = superGlobals.findOne({ spectacleStarted: { $exists: true}});
    var isSpectacleStarted = (spectacleStarted) ? spectacleStarted.spectacleStarted : false;
    console.log("isTheShowStarted", isSpectacleStarted);
    return isSpectacleStarted;
  },
  usersOnlineCount:function(){
   //event a count of users online too.
   return Meteor.users.find().count();
  },

  cuppasCount:function(){
    var cuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
    var theCuppasCount = (cuppasCount) ? cuppasCount.cuppasCount : 0;
    console.log("theCuppasCount", theCuppasCount);
   return theCuppasCount;
  },
  nbCuppasFinished: function(){
    var cuppasFinished = superGlobals.findOne({ nbCuppasFinished: { $exists: true}});
    var nbCuppasFinished = (cuppasFinished) ? cuppasFinished.nbCuppasFinished : 0;
    console.log("nbCuppasFinished", nbCuppasFinished);
   return nbCuppasFinished;
  },
  nextBucheAllumage:function(){
    var nextBuche = superGlobals.findOne({ nextBucheAllumage: { $exists: true}});
    var nextBucheAllumage = (nextBuche) ? nextBuche.nextBucheAllumage : 0;
    console.log("nextBucheAllumage", nextBucheAllumage);
   return nextBucheAllumage;
  },
  buchesCount: function(){
    var buchesCount = superGlobals.findOne({ buchesCount: { $exists: true}});
    var buchesArray = (buchesCount) ? buchesCount.buchesCount : 0;
    console.log("buchesArray", buchesArray);
   return buchesArray.length;
  },
  buchesArray: function(){
    var buchesCount = superGlobals.findOne({ buchesCount: { $exists: true}});
    var buchesArray = (buchesCount) ? buchesCount.buchesCount : [];
    console.log("buchesArray", buchesArray, buchesArray.sort().reverse());
   return buchesArray.sort().reverse();
  },
  loopCount: function(count){
    var countArr = [];
    for (var i=0; i<count; i++){
      countArr.push({});
    }
    return countArr;
  },

  dataArray: function (obj) {
    var arr = [], datas = obj;
    for (var key in datas) {
        var obj = {};
        obj.key = key;
        obj.value = datas[key];
        arr.push(obj);
    }
    return arr;
  },
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
  'click #fakeCuppasInc': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
  },
  'click #fakeCuppasFinished': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'finishCuppa'});
  },
  'click #resetSUPERinterrupt': function(){
    console.log("resetSUPERinterrupt!");
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    var bookmarkToGo = ($('#whereSUPERinterrupt').val() != "") ? $('#whereSUPERinterrupt').val() : 'spectacle';
    em.setClient({ bookmark: bookmarkToGo });
    em.emit('adminForceGoTo');
    Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: []});
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
  },
/*
  'submit #addcompteur': function(event){


      var newCompteur = $('#newCompteur').val();


      console.log("addcompteur submit", newCompteur);
      Meteor.call('createCompteurFromAdmin',newCompteur,function(err,result){
        if(!err){
          console.log("a new compteur just got created")
        } else {
          console.log("something goes wrong with the following error message " +err.reason )
        }
      });
           

      return false;


  },*/
  'click button.remove-SUPERinterrupt': function(event){

    if(Roles.userIsInRole(Meteor.user(), "admin")==true) {
      console.log('click button.remove-SUPERinterrupt', $(event.currentTarget).val());

      var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
      var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : false;
      console.log("parking from admin : is isSUPERinterrupt", isSUPERinterrupt);
      if(SUPERinterrupt !== false) {
        var parkingRole = $(event.currentTarget).val();
        console.log("parking from admin : disable FOR ONE ROLE -> ", parkingRole);
        //retirer role du tableau SUPERinterrupt (si déjà dedans)
        var found = jQuery.inArray(parkingRole, isSUPERinterrupt);
        if (found >= 0) {
          // Element was found, remove it.
          isSUPERinterrupt.splice(found, 1);
          console.log("parking from admin : disabling for ", parkingRole);
        } else {
          // Element was not found, don't remove it.
        }
      }
      // em.setClient({ value: isSUPERinterrupt });
      // em.emit('adminSUPERinterrupt');
      console.log("parking from admin : new SUPERinterrupt = ", isSUPERinterrupt);
      Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: isSUPERinterrupt});
    }
  },
  'click button.add-SUPERinterrupt': function(event){

      console.log('click button.add-SUPERinterrupt', $(event.currentTarget).val());

      var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
      var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : false;
      console.log("parking from admin : is isSUPERinterrupt", isSUPERinterrupt);
      if(SUPERinterrupt !== false) {

        var parkingRole = $(event.currentTarget).val();
        console.log("parking from admin : enable FOR ONE ROLE -> ", parkingRole);
        //retirer role du tableau SUPERinterrupt (si déjà dedans)
        var found = jQuery.inArray(parkingRole, isSUPERinterrupt);
        if (found >= 0) {
          // Element was found, don't add it again.
        } else {
          // Element was not found, add it.
          isSUPERinterrupt.push(parkingRole);
          console.log("parking : enabling for ", parkingRole);
        }
        console.log("parking from admin : new SUPERinterrupt = ", isSUPERinterrupt);
        Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: isSUPERinterrupt});
      }
      // em.setClient({ value: isSUPERinterrupt });
      // em.emit('adminSUPERinterrupt');




  }

});