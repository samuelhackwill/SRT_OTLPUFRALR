Template.registerHelper('equals', function (a, b) {
  return a == b;
});

// salut c'est sam

Template.adminBabySit.onCreated(function() {
  console.log('Template admin created.');
  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('allSuperGlobals');
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allLoteries');
  });

});

Template.adminBabySit.onRendered(function () {
  console.log('admin!');


  function myMIDIMessagehandler(event){

    // whichEtat = "e"+event.data[1]
    // console.log(whichEtat)


    if(event.data[0]==144 && event.data[1]==49){
      console.log("ca_va_peter cote client")
      em.emit("ca_va_peter")
      // donc là il faut instead qu'il appelle une fonction serveur qui fasse claquer un orage chez tous 
      // les clients
    }

    if(event.data[0]==144 && event.data[1]==45){
      em.setClient({ key: whichEtat });
      em.emit("new_ambiance")
    }

    // console.log(event.data)
  }

  output = null
  m = null; // m = MIDIAccess object for you to make calls on
  navigator.requestMIDIAccess().then( onsuccesscallback, onerrorcallback );

  function onsuccesscallback( access ) {
    m = access;

    // Things you can do with the MIDIAccess object:
    var inputs = m.inputs; // inputs = MIDIInputMaps, you can retrieve the inputs with iterators

    var iteratorInputs = inputs.values() // returns an iterator that loops over all inputs
    var input = iteratorInputs.next().value // get the first input


    var outputs = m.outputs; // outputs = MIDIOutputMaps, you can retrieve the outputs with iterators
    input.onmidimessage = myMIDIMessagehandler; // onmidimessage( event ), event.data & event.receivedTime are populated
    var iteratorOutputs = outputs.values() // returns an iterator that loops over all outputs
    output = iteratorOutputs.next().value; // grab first output device

    
  }

  function onerrorcallback( err ) {
    console.log( "uh-oh! Something went wrong! Error code: " + err.code );
  }

  
  $(document.body).addClass('admin');
  console.log(UserStatus);
  console.log(this.UserConnections);

  Meteor.subscribe('userStatus');
  Meteor.subscribe('allPhoneNumbers');
  Meteor.subscribe('allSuperGlobals');

  this.autorun(() => {
    console.log("showtime autorun admin", Template.instance());
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    // console.log("showtime contnus", contnus, data);
    // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    if(data.length == 0) {
      console.log('showtime retrieving data');
      data = ContenusEcran.findOne({name: "data_test"}).data
    }
    // console.log('showtime data ?', data);
    console.log('showtime ContenusEcran ?', ContenusEcran.find().fetch());
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
    //refresh switches
    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    $('input#josebove').bootstrapSwitch('state', !isItPowerToThePeople, true);
    var modeSpectacle = getSuperGlobal("modeSpectacle");
    $('input#showmode').bootstrapSwitch('state', modeSpectacle, true);
    var isTheShowStarted = getSuperGlobal("spectacleStarted", false);
    $('input#startSpectacle').bootstrapSwitch('state', isTheShowStarted, true);
  });



  var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
  console.log("showtime isItPowerToThePeople", isItPowerToThePeople);

  //recup compteur si on est en mode spectacle (par ex si on reload la page par inadvertance
  var modeSpectacle = getSuperGlobal("modeSpectacle");
  console.log('admin! compteur', compteur, "modeSpectacle", modeSpectacle);
  if(modeSpectacle) {
    console.log('admin! mode spectacle', compteur);
    //si on était en mode prendre le pouvoir, récupérer le compteur du cookie (= reprendre ou on en était)
    if(!isItPowerToThePeople) { //pouvoir à l'admin

      var compteurAdmin = getSuperGlobal("compteurAdmin");
      if(null !== compteurAdmin && compteurAdmin != compteur) {
        console.log('admin! compteurAdmin!=compteur');
        compteur = parseInt(compteurAdmin);
        // $('#currentCompteur').text(compteur);
        console.log('admin! compteur set to', compteur);
      }
    }

  } else {
    //on est pas en mode spectacle reset compteur
    Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});

  }
/*
  Polls.after.update(function (userId, doc, fieldNames, modifier, options) {
    em.emit('hi', userId, doc, fieldNames, modifier, options);
    console.log('after update', userId, doc, fieldNames, modifier, options);
  }, {fetchPrevious: false});
  
  */
  console.log('em', em);


  em.addListener('salmreponseoui', function(what) {
    //console.log('salm euh!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    //output.send([144, 69, 91]);
    //un_note = setTimeout(output.send([144, 52, 0]),1500)
    console.log('salm oui!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    if(what.mode == 'singlePlayer') {
      //mode single - play sound
      var son = new Audio('oui.ogg');
      son.addEventListener('playing', function(){
       console.log('oui playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      });
      son.play();
    } else if(what.mode == 'multiPlayer') {
      //mode multi - send midi
      output.send([144, 65, 91]);
      un_note = setTimeout(function(){ output.send([144, 65, 0])},10)
    }
  }); 

  em.addListener('salmreponsenon', function(what) {
    console.log('salm non!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    if(what.mode == 'singlePlayer') {
      //mode single - play sound
      var son = new Audio('non.ogg');
      son.addEventListener('playing', function(){
       console.log('non playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      });
      son.play();
    } else if(what.mode == 'multiPlayer') {
      //mode multi - send midi
      output.send([144, 67, 91]);
      un_note = setTimeout(function(){ output.send([144, 67, 0])},10)
    }
  }); 

  em.addListener('salmreponseeuh', function(what) {
    console.log('salm euh!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));

    if(what.mode == 'singlePlayer') {
      //mode single - play sound
      var son = new Audio('euuuh.ogg');
      son.addEventListener('playing', function(){
       console.log('euh playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      });
      son.play();
    } else if(what.mode == 'multiPlayer') {
      //mode multi - send midi
      output.send([144, 69, 91]);
      un_note = setTimeout(function(){ output.send([144, 69, 0])},10)
    }
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

  em.addListener('adminFireBuche', function(what) {
    console.log('admin FIRE a buche!', what);

    var buchesArray = getSuperGlobal("buchesCount", []);
    var buchesAllumees = buchesArray.filter(function(buche){ return buche; }).length;
    if(buchesAllumees > 0) {
      buchesToMidi = {
        midi1: [144, 84, 127],
        midi2: [144, 85, 127],
        midi3: [144, 86, 127],
        midi4: [144, 87, 127],
        midi5: [144, 88, 127],
        midi6: [144, 89, 127]
      }
      output.send(buchesToMidi['midi'+buchesAllumees]);
    } else if(buchesAllumees == 0) {
      //kill buches midi
      output.send([144, 84, 0]); // full velocity note on A4 on channel zero
      output.send([144, 85, 0]); // full velocity note on A4 on channel zero
      output.send([144, 86, 0]); // full velocity note on A4 on channel zero
      output.send([144, 87, 0]); // full velocity note on A4 on channel zero
      output.send([144, 88, 0]); // full velocity note on A4 on channel zero
      output.send([144, 89, 0]); // full velocity note on A4 on channel zero

    }
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

    // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    // console.log("le pouvoir 1 ?", powerToThePeople);
    // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    // console.log("le pouvoir 1 ?", isPowerToThePeople);
    Meteor.call('setSuperGlobal', {name: 'powerToThePeople', value: !data});

    // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    // console.log("le pouvoir 2 ?", powerToThePeople);
    // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    // console.log("le pouvoir 2 ?", isPowerToThePeople);

    em.setClient({ powerToThePeople: !data });
    em.emit('adminswitchthepower');
    if(data == true) { //power admin
      em.setClient({ bookmark: 'spectacle' });
      em.emit('adminForceGoTo');
      gotobookmark('spectacle');
    } else if(data == false) { //power retourne aux SALM
      // em.setClient({ bookmark: 'fin-spectacle' });
      // em.emit('adminForceGoTo');
      em.emit('adminUnStop');
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

  //activer le raccrochage
  //transformer en joli switch
  $('input#forcehangup').bootstrapSwitch();
  $('input#forcehangup').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('forcehangup ftw!');
    // event.preventDefault();
    console.log('activer le raccrochage? ', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'forceHangup', value: data});
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
    console.log('adminNext', compteur);
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
    console.log('adminNext2', compteur);
      compteur +=1
    console.log('adminNext3', compteur);
      var modeSpectacle = getSuperGlobal("modeSpectacle");
      var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
      var compteurAdmin = getSuperGlobal("compteurAdmin");
      console.log("adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin", compteurAdmin);
      if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurAdmin) != compteur) {
        console.log("admin next compteur set compteurAdmin", compteur)
        // cookies.set('compteurAdmin', compteur);
        Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});
      }
      // $('#currentCompteur').text(compteur);
      em.setClient({ compteur: compteur });
      em.emit('adminnext');
      next();
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

    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    if(!isItPowerToThePeople) {
      if(e.keyCode =='78' && compteur < data.length-1){
        // window.clearTimeout(autonextcontainer)
        // compteur +=1
        adminNext();
        console.log("keyup, ", compteur)
        // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
        // ça avance tout seul avec un délai)
      }
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



Template.adminBabySit.events({

  'click button#start' : function(){
    console.log('jose bové ftw!');
    // event.preventDefault();
    // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    // console.log("le pouvoir 1 ?", powerToThePeople);
    // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    // console.log("le pouvoir 1 ?", isPowerToThePeople);
    Meteor.call('setSuperGlobal', {name: 'powerToThePeople', value: !data});

    // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    // console.log("le pouvoir 2 ?", powerToThePeople);
    // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    // console.log("le pouvoir 2 ?", isPowerToThePeople);

    em.setClient({ powerToThePeople: !data });
    em.emit('adminswitchthepower');
    if(data == true) { //power admin
      em.setClient({ bookmark: 'spectacle' });
      em.emit('adminForceGoTo');
      gotobookmark('spectacle');
    } else if(data == false) { //power retourne aux SALM
      // em.setClient({ bookmark: 'fin-spectacle' });
      // em.emit('adminForceGoTo');
      em.emit('adminUnStop');
    }
  },

  'click button.Bnext': function(){
    em.emit('adminnext');
  },  

  'click button#lotterieOnh': function(){
    console.log("montrez moi les boutons de la lotterie s'il vous plaît")
// là il faut appeler la fonction ADDLOTTERYBUTTONS BISOUS JE VAIS ME COUCHER

  },

  'click button.hideB': function(){
    em.emit('adminhidetheone');
  },

  'click button#showButtonsToTheOne' : function(event){
    console.log('click button.pick-random-one', $(event.currentTarget).val(), this);
    args = {_id: this._id}
    Meteor.call('chooseRandomONE', args);
  },

  'click button#chooseSalm' : function(event){
    console.log('click button.deliver-messages', $(event.currentTarget).val(), this);
    args = {_id: this._id, name: this.name}
    em.setClient(args);
    em.emit('adminDeliverMessages');
  },

  'click input#setCompteur': function(){
    console.log('setCompteur', $('#adminCompteur').val());
    compteur = parseInt($('#adminCompteur').val())-1;
    //fake adminNext()
    window.clearTimeout(autonextcontainer)
    compteur +=1
    var modeSpectacle = getSuperGlobal("modeSpectacle");
    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    var compteurAdmin = getSuperGlobal("compteurAdmin");
    console.log("adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin?", compteurAdmin);
    if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurAdmin) != compteur) {
      console.log("admin next compteur set cookie", compteur)
      // cookies.set('compteurAdmin', compteur);
      Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});
    }
    // $('#currentCompteur').text(compteur);
    em.setClient({ compteur: compteur });
    em.emit('adminnext');
    next();
  }

});