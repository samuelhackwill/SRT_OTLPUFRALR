var streamCheckInterval;
var caughtUp = false;
var intervalReload;
headerOpen = false;


Template.spectacle.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allLoteries');
  });

});


Template.spectacle.onRendered(function () {

  allLang = TAPi18n.getLanguages()
  currentLang = TAPi18n.getLanguage()


  for (var i=0; i<Object.keys(allLang).length; i++){
    if(Object.keys(allLang)[i]==currentLang){
      currentLangIndex = i
    }
  }


  this.autorun(() => {

    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    data = ContenusEcran.findOne({name: "data_test"}).data
    dataPupitre = ContenusEcran.findOne({name: "data_test"}).dataPupitre
    console.log('srt spectacle spectacle rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    if(data) {
      catchUpWithTheShow();
    }
    //
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
  });

  function catchUpWithTheShow(){
    console.log('catchUpWithTheShow caughtUp?', caughtUp);
    if(!caughtUp) {
      caughtUp = true;
      console.log("checking compteur", compteur, "cookie.compteur", cookies.get('compteur'), modeSpectacle);
      //si on est en mode spectacle, que l'admin a le pouvoir
      var isPowerToThePeople = getSuperGlobal('powerToThePeople');
      if(modeSpectacle && !isPowerToThePeople) {
        //et si il y a un compteur enregistré
        var compteurAdmin = getSuperGlobal('compteurAdmin');
        console.log("checking compteurAdmin", compteurAdmin);

        if(null !== compteurAdmin) compteur = parseInt(compteurAdmin);
        if(compteur != -1) {
          //revenir où on était dans le spectacle
          next();
        }

        // AMBIANCE
        // TODO : ça marche ça?
        var whichAmbiance = getSuperGlobal("whichAmbiance", "");
        if(whichAmbiance != "") { //il y a une ambiance en cours
          //passons à cette ambiance
          var newAmbiance = ambiances.findOne({name: whichAmbiance});
          if(newAmbiance) {
            console.log("set Ambiance", newAmbiance.value)
            changeImg(newAmbiance.value)
          }
        }
      }
      
    }

  };

    em.addListener('showLTNumberClient', function(){
      // DEPRECATED
      switch(TAPi18n.getLanguage()){
        case "fr":
          $("<div>"+"Appelez ce numéro : <br /> + 33 (0)7 81 89 76 86 <br />(Et coupez le son de votre ordinateur! <br/>Sinon ça va faire des sons bizarres)."+"<br/</div>").appendTo("#phoneNumberSrt")
          break

        case "nl":
          $("<div>"+"Bel dit nummer : <br /> +33 7 81 89 76 86 <br/> (En schakel het geluid van jullie computer uit! Anders horen we allerlei rare geluiden)."+"<br/</div>").appendTo("#phoneNumberSrt")
          break

        case "de":
          $("<div>"+"Rufen Sie unter dieser Nummer an : <br /> +33 7 81 89 76 86 <br/> (Und schalten Sie Ihren Computer stumm! Sonst gibt es komische Geräusche.)"+"<br/</div>").appendTo("#phoneNumberSrt")
          break

        case "en":
          $("<div>"+"Call this number : <br /> +33 7 81 89 76 86 <br/> (And cut the sound on your computer\! Otherwise it\’ll make weird noises)"+"<br/</div>").appendTo("#phoneNumberSrt")
          break
      }
});


  em.addListener('showButtonsClient', function(){
    console.log('showTheOneButtons');
    switch(TAPi18n.getLanguage()){
      case "fr":
        $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
        break
      case "de":
        $('<button id="oui" class="button">ja</button><button id="non" class="button">nein</button><button id="euh" class="button">ääähm</button>').appendTo('#sacbouttons');
        break
      case "en":
        $('<button id="oui" class="button">yes</button><button id="non" class="button">no</button><button id="euh" class="button">um...</button>').appendTo('#sacbouttons');
        break
      case "nl":
        $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
        break
        }
      $("#sacbouttons").css("opacity", "1")
    });

  em.addListener('hideButtonsClient', function(){
    $("#phoneNumberSrt").empty()
    $("#sacbouttons").css("opacity", "0")
      delayedEmpty = setTimeout(function(){
      $("#sacbouttons").empty()
      },333)
  });


// });

function showMeTheButtons(){

    // if(Roles.userIsInRole(Meteor.user(), "spectacle_one")==true) {
  console.log('showMeTheButtons');

      switch(TAPi18n.getLanguage()){
      case "fr":
        $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
        break
      case "de":
        $('<button id="oui" class="button">ja</button><button id="non" class="button">nein</button><button id="euh" class="button">ääähm</button>').appendTo('#sacbouttons');
        break
      case "en":
        $('<button id="oui" class="button">yes</button><button id="non" class="button">no</button><button id="euh" class="button">um...</button>').appendTo('#sacbouttons');
        break
      case "nl":
        $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
        break
        }

  $("#sacbouttons").css("opacity", "1")
    // }

}

  em.addListener('startONHLotteryClient', function(){
    console.log("début de la lotterie ONH les shlags!")

            switch(TAPi18n.getLanguage()){
        case "fr":
          $("<div>Est-ce que vous êtes partant·e pour répondre aux questions de Jacques ?</div>").appendTo("#phoneNumberSrt")
          newBoutton(["ouiSP1","Oui","addUserToLottery('oui-non-euh')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["nonSP1","Non","destroy(id)", "$('#phoneNumberSrt').empty()"])
          break

        case "de":
          $("<div>Hätten Sie Lust, auf Jacques’ Fragen zu antworten?</div>").appendTo("#phoneNumberSrt")
          newBoutton(["ouiSP1","Ja","addUserToLottery('oui-non-euh')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["nonSP1","Nein","destroy(id)", "$('#phoneNumberSrt').empty()"])          
          break

        case "en":
          $("<div>Are you ready to answer Jacques\’ questions\?</div>").appendTo("#phoneNumberSrt")
          newBoutton(["ouiSP1","Yes","addUserToLottery('oui-non-euh')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["nonSP1","No","destroy(id)", "$('#phoneNumberSrt').empty()"])          
          break

        case "nl":
          $("<div>Heb je zin om de vragen van Jacques te beantwoorden?</div>").appendTo("#phoneNumberSrt")
          newBoutton(["ouiSP1","Ja","addUserToLottery('oui-non-euh')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["nonSP1","Nee","destroy(id)", "$('#phoneNumberSrt').empty()"])          
          break
        }
  });

  em.addListener('hideLTNumberClient', function(){
    $("#phoneNumberSrt").empty()
  });

  em.addListener('hideCabaneLotteryClient', function(){
    $("#phoneNumberSrt").empty()
    $("#sacbouttons").css("opacity", "0")
      delayedEmpty = setTimeout(function(){
      $("#sacbouttons").empty()
      },333)
  });

  em.addListener('startCabaneLotteryClient', function(){
    console.log("début de la lotterie Cabane les shlags!")
        switch(TAPi18n.getLanguage()){
        case "fr":
          $("<div>Est-ce que vous êtes partant·e pour faire une cabane ?</div>").appendTo("#phoneNumberSrt")
          newBoutton(["cuppasInc","Oui","addUserToLottery('cabane')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["boissonN","Non","destroy(id)", "$('#phoneNumberSrt').empty()"])
          break

        case "en":
          $("<div>Are you willing to build a hut ?</div>").appendTo("#phoneNumberSrt")
          newBoutton(["cuppasInc","Yes","addUserToLottery('cabane')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["boissonN","No","destroy(id)", "$('#phoneNumberSrt').empty()"])
          break        

        case "de":
          newBoutton(["cuppasInc","Ja","addUserToLottery('cabane')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["boissonN","Nein","destroy(id)", "$('#phoneNumberSrt').empty()"])
          $("<div>Hätten Sie Lust, eine Hütte zu bauen?</div>").appendTo("#phoneNumberSrt")
          break

        case "nl":
          newBoutton(["cuppasInc","Ja","addUserToLottery('cabane')","destroy(id)", "$('#phoneNumberSrt').empty()"])
          newBoutton(["boissonN","Nee","destroy(id)", "$('#phoneNumberSrt').empty()"])
          $("<div>Heb je zin om een hut te bouwen?</div>").appendTo("#phoneNumberSrt")
          break
        }
  });

  em.addListener('salmback', function(what) {
  console.log('salm back!', what);
    window.clearTimeout(autonextcontainer) //clear auto next
    // compteur += 1;
    compteur = what.compteur; //changer le compteur depuis l'évènement admin (rattraper le spectacle)
    back(); 
  });

  em.addListener('salmnext', function(what) {
    window.clearTimeout(autonextcontainer) //clear auto next
    // compteur += 1;
    compteur = what.compteur; //changer le compteur depuis l'évènement admin (rattraper le spectacle)
    next();
  }); 


  em.addListener('satBack', function(what) {
    window.clearTimeout(autonextcontainer) //clear auto next
    // compteur += 1;
    compteurPupitre = what.compteurPupitre; //changer le compteur depuis l'évènement admin (rattraper le spectacle)
    nlSatBack();
  });

  em.addListener('satNext', function(what) {
    window.clearTimeout(autonextcontainer) //clear auto next
    // compteur += 1;
    compteurPupitre = what.compteurPupitre; //changer le compteur depuis l'évènement admin (rattraper le spectacle)
    nlSatNext();
  }); 

  em.addListener('satForceGoTo', function(what) {
    console.log('sat salmForceGoTo!', what);
    // compteur = what.compteur;
    console.log("gotobookmarkPUPITRE(what.bookmark);")
  }); 

  em.addListener('displayBlackSalm', function(){
    console.log('displayBlackSalm')
    $('#srt').empty()
  });

  em.addListener('salmForceGoTo', function(what) {
    console.log('salm salmForceGoTo!', what);
    // compteur = what.compteur;
    gotobookmark(what.bookmark);
  }); 

  em.addListener('salmrefreshpage', function(what) {
    console.log('salm refresh page!', what);
    location.reload();
  }); 


  em.addListener('salmpoweradmin', function(what) {
    console.log('salm admin has the power!', what);
    console.log("le pouvoir est aux mains de l'admin", streamCheckInterval);
    //faire des trucs quand l'admin prend le pouvoir
    startTheStream();
    //lancer le check du stream à interval régulier
    console.log("streamCheckInterval?", streamCheckInterval);
    /*
    if (!streamCheckInterval) {
        console.log("starting streamCheckInterval 1");
        streamCheckInterval = setInterval(function(){checkTheStream();}, 5000); 
        console.log("starting streamCheckInterval 2", streamCheckInterval);
    }
    */
  });

  em.addListener('displayBlackSat', function(){
    console.log('displayBlackSat')
    $('#nlsrt').empty()
  });

  em.addListener('salmpowerpeople', function(what) {
    console.log('salm people have the power!', what);
      console.log("le pouvoir est aux mains du peuple", streamCheckInterval);
      /*
      //arretons le check du stream à interval régulier
      console.log("stopping streamCheckInterval 1", streamCheckInterval);
      clearInterval(streamCheckInterval); 
      streamCheckInterval = null;
      console.log("stopping streamCheckInterval 2", streamCheckInterval);
      */
  }); 
  em.addListener('salmUnStop', function(what) {
    console.log('salm unstop', what);
    console.log('salm unstop - interrupt?', interrupt);
    unstop();
  }); 


  em.addListener('salmGetMessage', function(what) {
    console.log('salm get message', what);
    if(what.name != "") { //checkons le nom de la loterie
      var lotteryCookie = cookies.get(what.name);
      if(lotteryCookie) { //le cookie de cette loterie est bien là
        console.log('salm get message lotteryCookie', lotteryCookie);
        Meteor.call('retrieveMessage', what._id, lotteryCookie, function(error, result) {
          // 'result' is the method return value
          if(error) console.log("error", error);
          if(result) {
            console.log("result", result);
            var resultParsed = result.replace(/(\w+)\(?.*/, '$1');
            console.log("resultParsed", resultParsed);
            switch(resultParsed) {
              case 'showMeTheButtons':
                showMeTheButtons();
                break;
              case 'addCuppasButtons':
                addCuppasButtons();
                break;
              case 'displayPhoneNumbers':
                console.log("DISPLAY PHONE NUMBERS");
              default:
                break;
            }
          }
        });
      }
    }
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

  // var host = window.location.hostname == "localhost" ? "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com" : window.location.hostname;
  // var host = window.location.hostname == "localhost" ? "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com" : window.location.hostname;
  var host = "ontraverseralepont.com";
  var server = null;
  if(window.location.protocol === 'http:')
      server = "http://" + host + ":8088/janus";
  else
      server = "https://" + host + ":8089/janus";

  var janus = null;
  // var streaming = null;
  streaming = null;
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
              //si le pouvoir est déjà aux mains de l'admin lancons le stream au chargement de la page
              // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
              // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
              var isPowerToThePeople = getSuperGlobal("powerToThePeople", false); // par défaut false, admin a le pouvoir -> donc lancer le stream (?)
              if(!isPowerToThePeople) {
                console.log("le pouvoir est déjà aux mains de l'admin lancons le stream au chargement de la page");
                startTheStream();
              }

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
        console.log("ERROR !!! :"+error);
        // var body = { "request": "stop" };
        // streaming.send({"message": body});
        // streaming.hangup();
        //TODO setTimeout hangup + setTimeout request watch à nouveau? à tester en régie avec lieven
        // bootbox.alert(error, function() {
        //   window.location.reload();
        // });
        var waitBeforeReload = 10 //secondes;
        switch(currentLang){
          case "fr":
          $('#stream-error').append("Il semble que la connection avec le serveur a été perdue. La page va se recharger dans <span>"+waitBeforeReload+" seconde(s)</span>. (<a href=\"javascript:void(0);\" class=\"reload\" title=\"Annuler le rechargement\">Recharger maintenant</a> ou <a href=\"javascript:void(0);\" class=\"cancel\" title=\"Annuler le rechargement\">Annuler</a>)");
          break;

          case "en":
          $('#stream-error').append("It looks like we've lost connection with the server. Page reloading in <span>"+waitBeforeReload+" second(s)</span>. (<a href=\"javascript:void(0);\" class=\"reload\" title=\"Annuler le rechargement\">Recharger maintenant</a> ou <a href=\"javascript:void(0);\" class=\"cancel\" title=\"Annuler le rechargement\">Annuler</a>)");
          break;

          case "de":
          $('#stream-error').append("It looks like we've lost connection with the server. Page reloading in <span>"+waitBeforeReload+" second(s)</span>. (<a href=\"javascript:void(0);\" class=\"reload\" title=\"Annuler le rechargement\">Recharger maintenant</a> ou <a href=\"javascript:void(0);\" class=\"cancel\" title=\"Annuler le rechargement\">Annuler</a>)");
          break;

          case "nl":
          $('#stream-error').append("It looks like we've lost connection with the server. Page reloading in <span>"+waitBeforeReload+" second(s)</span>. (<a href=\"javascript:void(0);\" class=\"reload\" title=\"Annuler le rechargement\">Recharger maintenant</a> ou <a href=\"javascript:void(0);\" class=\"cancel\" title=\"Annuler le rechargement\">Annuler</a>)");
          break;
        }

        $('#stream-error a.reload').click(function(){
          console.log("Manual page reload.");
          window.location.reload();
        });
        $('#stream-error a.cancel').click(function(){
          console.log("cancelling auto page reload.");
          clearInterval(intervalReload);
          $('#stream-error').empty(); //vider l'élément d'erreur
        });
        var count = waitBeforeReload;
        intervalReload = setInterval(function(){
          $('#stream-error').find('span').text(count == 1 ? count+" seconde" : count+" secondes");
          count -= 1;
          if (count === 0){
            clearInterval(intervalReload); // Stopping the counter when reaching 0.
            console.log("Stream error reloading");
            window.location.reload();
          }
        }, 1000);

      },
      destroyed: function() {
        console.log("destroyed");
        window.location.reload();
      }
    });
  }});

  
  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    if(e.keyCode == '32') nextEvent();
  });

  var alternanceStorm = false;
  var balayeur

  em.addListener('new_ambiance_client', function(what) {

    console.log(what)
    changeImg(what)

    // SAM1

    // var ambiance = superGlobals.findOne({ whichAmbiance: { $exists: true}});
    // var whichAmbiance = (ambiance) ? ambiance.whichAmbiance : "e41";
    // var whichAmbiance = getSuperGlobal("whichAmbiance", "e41");

    // var newAmbiance = ambiances.findOne({name: whichAmbiance});
    // console.log("ambiance?", newAmbiance);
    // if(newAmbiance){
    //   console.log("new Ambiance", newAmbiance.value)
    //   changeImg(newAmbiance.value)
    // }

  });

  em.addListener('ca_va_peter_client', function(/* client */) {
        if(alternanceStorm){
          clearTimeout(balayeur)
          $( ".eclair" ).remove();
          $('#gcontainer').prepend('<div class="eclair2"></div>');
          alternanceStorm = false;
        }else{
          clearTimeout(balayeur)
          $( ".eclair2" ).remove();
          $('#gcontainer').prepend('<div class="eclair"></div>');
          alternanceStorm = true;
        }
        balayeur = setTimeout(balayeurfunc,2500)
    });

  em.addListener('salmstartstream', startTheStream);

  function startTheStream(what) {

    console.log('salm startstream!', what, streaming);
    if(streaming) {
      var body = { "request": "watch", id: parseInt(1) };
      streaming.send({"message": body});
    }

  }

});

var nextEvent = function(){
  console.log("NEXT EVENT")
  // var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
  var isItPowerToThePeople = getSuperGlobal("powerToThePeople", true);
  console.log('spectacle keyup compteur = ', compteur, 'interrupt = ', interrupt, 'isItPowerToThePeople = ', isItPowerToThePeople);
  if(compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true){
    window.clearTimeout(autonextcontainer)
    compteur +=1
    next();
    console.log("keyup, ", compteur)
    // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
    // ça avance tout seul avec un délai)
  }
}

Template.spectacle.events({

  'click #Bug' : function(){
    alert("Nous sommes désolés que ça ne fonctionne pas! Le problème peut venir de plusieurs endroits : de la connection internet du théâtre (auquel cas vous ne pouvez pas faire grand chose!), de votre machine, de votre navigateur web, ou de votre connection internet. \n\n PROBLEME 1. Je n'ai jamais entendu le moindre son \n SOLUTIONS POSSIBLES : rechargez la page, mettez à jour votre navigateur web, essayez sur une autre machine, ou même sur un téléphone. \n\n PROBLEME 2. Le son est haché \n SOLUTIONS POSSIBLES : rapprochez-vous de votre box, essayez de vous connecter en filaire, si vous en avez les moyens essayez en partage de connection 4G avec votre téléphone.");
    em.emit('bugClick');
  },

  'click #menu' : function(){
    headerOpen=!headerOpen

    if(headerOpen){
      document.getElementById("header").style.transform = "translateY(0%)"
      document.getElementById("menu").innerHTML = "X"
    }else{
      document.getElementById("header").style.transform = "translateY(-100%)" 
      document.getElementById("menu").innerHTML = "?"
    }
  },

  'click #lan' : function(){

    if(currentLangIndex < Object.keys(allLang).length-1){
      currentLangIndex += 1
      TAPi18n.setLanguage(Object.keys(allLang)[currentLangIndex])
    }else{
      currentLangIndex=0
      TAPi18n.setLanguage(Object.keys(allLang)[currentLangIndex])
    }
    cookies.set("user_lan", Object.keys(allLang)[currentLangIndex])

    if(getSuperGlobal("powerToThePeople")==true){
      next()
    }
  },

  'click #cuppasInc': function(){
  //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
  Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
  },

  // 'click #cuppasDec': function(){
  //   Meteor.call('setSuperGlobal', {name: 'cuppasDec'});
  // },

  // 'click #finishCuppa': function(){
  //   Meteor.call('setSuperGlobal', {name: 'finishCuppa'});
  // },
  
  'click #oui': function(){
    console.log('salmclick oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'oui', mode: 'singlePlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited');
    console.log('salmclick emmited oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #non': function(){
    console.log('salmclick non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'non', mode: 'singlePlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #euh': function(){
    console.log('salmclick euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'euh', mode: 'singlePlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #ouiMP': function(){
    console.log('salmclick oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'oui', mode: 'multiPlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited');
    console.log('salmclick emmited oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #nonMP': function(){
    console.log('salmclick non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'non', mode: 'multiPlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #euhMP': function(){
    console.log('salmclick euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'euh', mode: 'multiPlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },

  'touchstart #gcontainer': function(){
    // alert('touchstart #gcontainer');
    nextEvent();
  }

})

  function balayeurfunc(){
          $( ".eclair" ).remove();
          $( ".eclair2" ).remove();
  }
