Template.registerHelper('formatDateHeure', function(date) {
  return moment(date).format('dddd D MMM YYYY à HH:mm');
});


Template.data.onCreated(function() {

  //subscribe à la collection contenus écran + representations
  this.autorun(() => {
    this.subscribe('superGlobals');
  });

});

Template.spectacle.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
  });

});
Template.spectacle.helpers({

  doYouHavePower:function(){
    var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    console.log(powerToThePeople);
    return powerToThePeople.powerToThePeople ? 'powerToThePeople' : 'powerToTheAdmin';
  },
  listRepresentations:function(){
    console.log("listRepresentations??", representations.find().fetch());
    return representations.find();
  }
});

Template.spectacle.onRendered(function () {



  this.autorun(() => {
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    data = ContenusEcran.findOne({name: "text-spectacle"}).data
    console.log('srt spectacle rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    console.log("isItPowerToThePeople", isItPowerToThePeople);
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    autonext(2000);
  });


  em.addListener('salmnext', function(what) {
    console.log('salm next!', what);
    compteur = what.compteur;
    next();
  }); 

  // var streamStarted = Meteor.superGlobals.findOne({}, {fields: {name: 1, _id: 0}}).name;
  Meteor.call('isTheStreamStarted', function(result){
    console.log(result);
  });
  // console.log()
  // superGlobals.find({});
    //   {},{fields: {'source':"SourceOne", 'currency': "USD"}}
    // ));

  //streaming janus
  var server = null;
  // if(window.location.protocol === 'http:')
  //     server = "http://" + window.location.hostname + ":8088/janus";
  // else
  //     server = "https://" + window.location.hostname + ":8089/janus";

  var host = window.location.hostname == "localhost" ? "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com" : window.location.hostname;
  var server = null;
  if(window.location.protocol === 'http:')
      server = "http://" + host + ":8088/janus";
  else
      server = "https://" + host + ":8089/janus";

  var janus = null;
  var streaming = null;
  var started = false;
  var spinner = null;

  var selectedStream = null;

  // Initialize the library (all console debuggers enabled)
  Janus.init({debug: "all", callback: function() {
    
    console.log('Janus initiated.');

    // Use a button to start the demo
    // $('#start').click(function() {
    if(started)
      return;
    started = true;

    // $(this).attr('disabled', true).unbind('click');
    // Make sure the browser supports WebRTC
    if(!Janus.isWebrtcSupported()) {
      console.log("No WebRTC support... ");
      return;
    }
    console.log('WebRTC is supported.');
    console.log('Creating Janus Session...');
    // Create session
    janus = new Janus({
      server: server,
      success: function() {
        // Attach to streaming plugin
        janus.attach({
          plugin: "janus.plugin.streaming",
          success: function(pluginHandle) {
            // $('#details').remove();
            streaming = pluginHandle;
            Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
            console.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
            // Setup streaming session
            // $('#update-streams').click(updateStreamsList);
            // updateStreamsList();
            //janus.destroy();

          },
          error: function(error) {
            Janus.error("  -- Error attaching plugin... ", error);
            console.log("Error attaching plugin... " + error);
          },
          onmessage: function(msg, jsep) {
            Janus.debug(" ::: Got a message :::");
            Janus.debug(JSON.stringify(msg));
            var result = msg["result"];
            if(result !== null && result !== undefined) {
              if(result["status"] !== undefined && result["status"] !== null) {
                var status = result["status"];
                if(status === 'starting')
                  console.log("Message : Starting, please wait...");
                  // $('#status').removeClass('hide').text("Starting, please wait...").show();
                else if(status === 'started')
                  console.log("Message : Started");
                  // $('#status').removeClass('hide').text("Started").show();
                else if(status === 'stopped')
                  stopStream();
              }
            } else if(msg["error"] !== undefined && msg["error"] !== null) {
              console.log("Message : "+msg["error"]);
              stopStream();
              return;
            }
            if(jsep !== undefined && jsep !== null) {
              Janus.debug("Handling SDP as well...");
              Janus.debug(jsep);
              // Answer
              streaming.createAnswer({
                jsep: jsep,
                media: { audioSend: false, videoSend: false },  // We want recvonly audio/video
                success: function(jsep) {
                  Janus.debug("Got SDP!");
                  Janus.debug(jsep);
                  var body = { "request": "start" };
                  streaming.send({"message": body, "jsep": jsep});
                  // $('#watch').html("Stop").removeAttr('disabled').click(stopStream);
                },
                error: function(error) {
                  Janus.error("WebRTC error:", error);
                  console.log("WebRTC error... " + JSON.stringify(error));
                }
              });
            }
          },
          onremotestream: function(stream) {
            Janus.debug(" ::: Got a remote stream :::");
            console.log(" ::: Got a remote stream :::");
            console.log(JSON.stringify(stream));
            Janus.debug(JSON.stringify(stream));
            // if($('#remotevideo').length === 0)
            //   $('#stream').append('<video class="rounded centered hide" id="remotevideo" width=320 height=240 autoplay/>');
            // Show the stream and hide the spinner when we get a playing event
            // $("#remotevideo").bind("playing", function () {
            //   $('#waitingvideo').remove();
            //   $('#remotevideo').removeClass('hide');
            //   if(spinner !== null && spinner !== undefined)
            //     spinner.stop();
            //   spinner = null;
            // });
            // Janus.attachMediaStream($('#remotevideo').get(0), stream);
            console.log($('#stream-video'), $('#stream-video').get(0));
            Janus.attachMediaStream($('#stream-video').get(0), stream);
          },
          oncleanup: function() {
            Janus.log(" ::: Got a cleanup notification :::");
            // $('#waitingvideo').remove();
            // $('#remotevideo').remove();
          }
        });
      },
      error: function(error) {
        Janus.error(error);
        console.log(error);
        // bootbox.alert(error, function() {
        //   window.location.reload();
        // });
      },
      destroyed: function() {
        console.log("destroyed");
        window.location.reload();
      }
    });
  }});

  // var compteur = 0;
  // if(Session.get('compteur') >= "6") {
  //   compteur = Session.get('compteur');
  // }
  // console.log('compteur', compteur);

  // var delay = 3000
  // le premier delay de defilement auto entre data[0] et data[1]
  //data (pré-/)spectacle
/*  var data = {

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
*/
/*
  function next(){
    // console.log('next', compteur);
    // if(compteur >= 75) compteur = 75;
    var currentSub = data[compteur]
    document.getElementById("srt").innerHTML = currentSub
    // ça c'est pour virer le focus des boutons oui et non histoire de pas les activer en appuyant sur espace
    // Session.update("compteur", compteur);
  }*/

  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"

    if(e.keyCode =='32' && compteur < data.length-1 && interupt==false){
      window.clearTimeout(autonextcontainer)
      compteur +=1
      next();
      console.log("keyup, ", compteur)
      // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
      // ça avance tout seul avec un délai)
    }
  });



  em.addListener('salmstartstream', startTheStream);

  function startTheStream(what) {

    console.log('salm startstream!', what, streaming);

    var body = { "request": "watch", id: parseInt(1) };
    streaming.send({"message": body});
    // if($('#streamFrame').length == 0) {

    //   $('<iframe>', {
    //   'src': 'http://www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com/stream/',
    //    id:  'streamFrame',
    //    frameborder: 0,
    //    scrolling: 'no'
    //   }).appendTo('#stream-ifr');


    //   setTimeout(function(){
    //     console.log('streamFrame', $("#streamFrame").contents().find('#start'));
    //     var startButton = $("#streamFrame").contents().find('#start');
    //     if(startButton.length > 0) {
    //       startButton.trigger('click');
    //     }
    //   }, 2000);
    //   // $('streamFrame').on('load', function(){
    //   //   console.log('streamFrame loaded');
    //   // });
    //   // console.log('streamFrame added');
    //   // $('streamFrame').attr();
    //   // console.log('streamFrame src', $('streamFrame').attr('src'));
    // }



  }


  function chooseTheShow(what) {

    console.log('salm chooseTheShow!', what);
    $('#shows-list').removeClass('hidden');
  }

});


// TO DO
// balises pour afficher du texte ailleurs que dans SRT (checklist, rubrique fiction)

// var compteurquest = -1
// var compteur = -1
// // ça c'est pour commencer au 0 du tableau.
// var interupt = false
// var indeximg = 0
// var alternance = false
// var autonextcontainer
// var flipbookstatus = false

// // var data = data;

// var posanswers =["disponible", "à la maison", "tranquille", "son ok", "concentré"]
// var neganswers =["occupé","en ville","pas seul", "mute", "distrait"]
