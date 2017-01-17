
Template.data.onCreated(function() {

  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('superGlobals');
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
  });

});

Template.admin.onRendered(function () {
  console.log('admin!');
  console.log(UserStatus);
  console.log(this.UserConnections);

  Meteor.subscribe('userStatus');
  Meteor.subscribe('allPhoneNumbers');
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


  //prendre le pouvoir
  //transformer en joli switch
  $('input#josebove').bootstrapSwitch();
  $('input#josebove').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('jose bové ftw!');
    // event.preventDefault();
    console.log('prendre le pouvoir? ', data, $(this).val());
    // Meteor.call('toggleScraper', data.value);
    Meteor.call('setSuperGlobal', {name: 'powerToThePeople', value: !data});
  });
  //activer le mode spectacle
  //transformer en joli switch
  $('input#showmode').bootstrapSwitch();
  $('input#showmode').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('showmode ftw!');
    // event.preventDefault();
    console.log('activer le mode spectacle? ', data, $(this).val());
    // Meteor.call('toggleScraper', data.value);
    Meteor.call('setSuperGlobal', {name: 'modeSpectacle', value: data});
    em.emit('adminrefreshpage');
  });


  // TO DO

  // cookie quand quelqu'un arrive au bout
  // attention y'a un bug avec les boutons que j'ai pseudo-rêglé en empêchant les mouseevents quand le compteur =! x ou y


  compteur = 18;
  // if(Session.get('compteur') >= "6") {
  //   compteur = Session.get('compteur');
  // }
  // console.log('compteur', compteur);

  var delay = 3000
  // le premier delay de defilement auto entre data[0] et data[1]

  var data = {

    "0":"bienvenue,",
    "1":"c’est samuel à nouveau",
    "2":"je suis dans la salle du spectacle, on est en train de préparer l’arrivée des spectateurs-trices",
    "3":"et moi, je m’occupe de votre arrivée : celle des spectateurs-trices à la maison.",
    "4":"on est un bon petit groupe",
    "5":"ça va démarrer dans un petit moment.",
    "6":"en attendant que tout le monde arrive, je vous propose d’écouter une petite musique sympa",
    "7":"vous pouvez aller faire la vaisselle ou lire une bd,",
    "8":"comme vous voulez",
    "9":"l’essentiel étant que toute à l’heure, ",
    "10":"on vous rappellera quelques secondes avant le vrai début du spectacle.",
    "11":"par voie sonore",
    "12":"du coup il faut que vous entendiez bien votre ordinateur",
    "13":"donc hésitez pas à pousser le son.",
    "14":"vous l’entendez la musique hein?",
    "15":"si vous n’entendez aucun son il est encore temps",
    "16":"de télécharger la dernière version de google chrome",
    "17":"avec ce navigateur on est sûrs à 100% que notre web app fonctionne.",
    "18":"à toute à l’heure.",
    "19":"",
    "20":"",
    "21":"",
    "22":"Hello again",
    "23":"c'est samuel",
    "24":"bon alors là je suis carrément en régie",
    "25":"lieven est à côté de moi",
    "26":"c'est lui qui s'occupe du son sur le spectacle",
    "27":"les comédiens quant à eux",
    "28":"sont en train de se taper dans les mains pour se donner du courage",
    "29":"le spectacle va bientôt commencer.",
    "30":"vous pouvez appuyer sur la barre espace s'il vous plaît?",
    "31":"merci",
    "32":"bon alors",
    "33":"vous avez sûrement remarqué",
    "34":"mais c'est pas sûr",
    "35":"genre si par un hasard étonnant",
    "36":"certains d'entre vous appuient depuis le début sur la barre espace",
    "37":"pile au moment où j'envoie les textes",
    "38":"ben dans ce cas-ci vous pourriez avoir l'illusion que c'est encore vous ",
    "39":"qui pilotez la progression des surtitres",
    "40":"bon mais il y a peu de chances quand même",
    "41":"il est quand même plus probable que ",
    "42":"vous ayez remarqué que vous n'aviez plus la main",
    "43":"et que là vous vous relaxez devant votre ordinateur",
    "44":"bon quand à moi je sens la responsabilité qui pèse sur mes épaules",
    "45":"j'appuie sur la barre espace ",
    "46":"lentement, ",
    "47":"j'essaye de ne pas aller trop vite pour que chacun puisse lire",
    "48":"en tout cas le rythme n'est plus le même",
    "49":"quand vous avez accédé à ce site pour la première fois,",
    "50":"chacun pouvait en fait évoluer à sa vitesse",
    "51":"alors que maintenant",
    "52":"la lecture sur ce site est passée en mode spectacle",
    "53":"le rythme est homogène pour tous",
    "54":"et c'est moi qui en maîtrise le tempo.",
    "55":"ça permet de faire en sorte",
    "56":"que tout le monde reçoive les mêmes informations au même instant",
    "57":"d'ailleurs c'est le moment de vous dévoiler",
    "58":"qu'on a choisi une personne parmi vous",
    "59":"de manière arbitraire",
    "60":"pour tester une séquence de rencontre entre les spectateurs à la maison",
    "61":"et les comédiens,",
    "62":"et par voie de conséquence, avec les spectateurs au théâtre.",
    "63":"on va se serrer la main psychiquement en quelque sorte",
    "64":"cette séquence s'appelle le 'oui non euh'",
    "65":"alors euh pour la personne qui a été choisie",
    "66":"est ce que vous voyez apparaître les boutons là maintenant?",
    "67":"si vous ne les voyez pas apparaître,",
    "68":"pas d’inquiétude, c'est sûrement que vous n'êtes pas le S.A.L.M.",
    "69":"chargé de réaliser la poignée de main psychique.",
    "70":"vous serez juste derrière le S.A.L.M. qui a été choisi",
    "71":"et vous assisterez tout de même à ce moment historique",
    "72":"de rencontre entre deux civilisations.",
    "73":"bon je vais vous passer Antoine il veut vous dire un truc.",
    "74":"je vous souhaite un bon spectacle à la maison.",
    "75":"",
    "76":"",
    "77":"",
    "78":"Et donc voilà,",
    "79":"",
    "80":"il n’y a pas grand chose d'autre ",
    "81":"",
    "82":"que cette connexion elle-même,",
    "83":"",
    "84":"qui est à la fois invisible,",
    "85":"",
    "86":"imperceptible, immatérielle,",
    "87":"",
    "88":"et qui pourtant qui existe bel et bien :",
    "89":"",
    "90":"Elle s’effectue par l’intermédiaire de câbles, ",
    "91":"",
    "92":"d'antennes relais, et d’ondes électromagnétique. ",
    "93":"",
    "94":"Il y a peut-être une dizaine de petites machines qui palpitent, ",
    "95":"",
    "96":"des routeurs, des serveurs, ",
    "97":"",
    "98":"juste pour maintenir cette connexion en vie.",
    "99":"",
    "100":"Elle aboutit d'ailleurs effectivement quelque part,",
    "101":"",
    "102":"elle nous emmène chez quelqu’un.",
    "103":"",
    "104":"Si on pouvait suivre son chemin,",
    "105":"",
    "106":"on sortirait par les trous de l'écouteur du téléphone,",
    "107":"",
    "108":"sur une table,",
    "109":"",
    "110":"sur un canapé,",
    "111":"",
    "112":"ou dans la main de cette personne",
    "113":"",
    "114":"qui vit la même expérience que nous ",
    "115":"",
    "116":"mais de l’autre côté.",
    "117":"",
    "118":"Bon, exceptionnellement, pour ce test là,",
    "119":"",
    "120":"on n'a pas choisi au hasard un spectateur,",
    "121":"",
    "122":"on a demandé à notre ami Arnaud",
    "123":"",
    "124":"si on pouvait l'appeler.",
    "125":"",
    "126":"Là il est chez lui,",
    "127":"",
    "128":"à Lille,",
    "129":"",
    "130":"de l’autre côté de la liaison téléphonique.",
    "131":"",
    "132":"Il doit être en train de tendre l’oreille",
    "133":"",
    "134":"pour vérifier s’il n’entendrait pas quand même",
    "135":"",
    "136":"quelques bruits ",
    "137":"",
    "138":"qui émaneraient du public,",
    "139":"",
    "140":"les toussotements,",
    "141":"",
    "142":"le grincement des sièges.",
    "143":"",
    "144":"",
    "145":"",
    "146":"salut c’est encore Samuel",
    "147":"la présentation touche à son terme",
    "148":"merci beaucoup de vous être prêtés au jeu",
    "149":"on espère que vous avez aimé ça",
    "150":"que ça vous a fait réfléchir à des trucs",
    "151":"d’ailleurs si jamais vous aviez envie de nous communiquer une réaction à chaud",
    "152":"n’hésitez pas, ça nous aiderait bien",
    "153":"vous pouvez m’envoyer un mail que je transmettrai au reste de l’équipe.",
    "154":"à cette adresse donc",
    "155":"hackmew@gmail.com",
    "156":"bisous",
    "157":"",
    "158":"",
    "159":"",
  }


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
    console.log("isPowerToTheAdminChecked", powerToThePeople);
    return !powerToThePeople;
  },
  isModeSpectacleChecked:function(){
    var modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
    console.log("isModeSpectacleChecked", modeSpectacle);
    return modeSpectacle;
  },
  usersOnlineCount:function(){
   //event a count of users online too.
   return Meteor.users.find().count();
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