
var streamCheckInterval;

Template.jacky.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
  });

});


Template.jacky.onRendered(function () {


  this.autorun(() => {
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    console.log('srt spectacle jacky rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
  });

  em.addListener('salmtheoneshow', showTheOneButtons);
  em.addListener('salmtheonehide', hideTheOneButtons);

  function showTheOneButtons(){

    if(Roles.userIsInRole(Meteor.user(), "jacky_one")==true) {
      console.log('showTheOneButtons');
      $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
      $('#sacbouttons').removeClass('invisible');
      $('#sacbouttons').addClass('visible');
    }

  }


  function hideTheOneButtons(){
    $('#oui, #non, #euh').hide();
  }

// });



  em.addListener('salmnext', function(what) {
    console.log('salm next!', what);
    // compteur = what.compteur;
    var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : [];
    var userRoles = Roles.getRolesForUser(Meteor.user());
    if(userRoles.length == 0) userRoles.push("salm");
    console.log("salm next : isSUPERinterrupt", isSUPERinterrupt, userRoles);
    var found = jQuery.inArray(userRoles[0], isSUPERinterrupt);
    if (found >= 0) {
      //ce role est dans le parking !
    } else {
      //ce role n'est pas dans le parking, faisons un next
      console.log('pas dans le parking, faisons un next')
      compteur += 1;
      next();
    } 
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
  
  // var streamStarted = Meteor.superGlobals.findOne({}, {fields: {name: 1, _id: 0}}).name;
  Meteor.call('isTheStreamStarted', function(result){
    console.log(result);
  });


  em.addListener('salmpoweradmin', function(what) {
    console.log('salm admin has the power!', what);
    console.log("le pouvoir est aux mains de l'admin", streamCheckInterval);
    //faire des trucs quand l'admin prend le pouvoir
    startTheStream();
    //lancer le check du stream à interval régulier
    console.log("streamCheckInterval?", streamCheckInterval);

    if (!streamCheckInterval) {
        console.log("starting streamCheckInterval 1");
        streamCheckInterval = setInterval(function(){checkTheStream();}, 5000); 
        console.log("starting streamCheckInterval 2", streamCheckInterval);
    }
  });
  em.addListener('salmpowerpeople', function(what) {
    console.log('salm people have the power!', what);
      console.log("le pouvoir est aux mains du peuple", streamCheckInterval);
      //arretons le check du stream à interval régulier
      console.log("stopping streamCheckInterval 1", streamCheckInterval);
      clearInterval(streamCheckInterval); 
      streamCheckInterval = null;
      console.log("stopping streamCheckInterval 2", streamCheckInterval);
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
              //si le pouvoir est déjà aux mains de l'admin lancons le stream au chargement de la page
              var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
              var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
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


  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"

    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    console.log('spectacle keyup compteur = ', compteur, 'interrupt = ', interrupt, 'isItPowerToThePeople = ', isItPowerToThePeople);
    if(e.keyCode =='32' && compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true){
      window.clearTimeout(autonextcontainer)
      compteur +=1
      next();
      console.log("keyup, ", compteur)
      // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
      // ça avance tout seul avec un délai)
    }
  });

  var alternanceStorm = false;
  var balayeur

  em.addListener('new_ambiance_client', function() {
    var ambiance = superGlobals.findOne({ whichAmbiance: { $exists: true}});
    var whichAmbiance = (ambiance) ? ambiance.whichAmbiance : "e41";
    if(etats[whichAmbiance]){
      console.log(etats[whichAmbiance])
      changeImg(etats[whichAmbiance])    
    }
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

    alternanceImg = false;

  function changeImg(params){

    if($("#imgcontainerBACK").hasClass( "invisible")){
      $('#imgcontainerBACK').removeClass('invisible');
      $('#imgcontainerBACK').addClass('visible');
    }

    if (alternanceImg==true) {
      $("#imgcontainerFRONT").css("background-image", "url(/img/"+params+".jpg");  
      $('#imgcontainerFRONT').removeClass('invisible');
      $('#imgcontainerFRONT').addClass('visible');
    }else{
      $("#imgcontainerBACK").css("background-image", "url(/img/rain3.jpg");  
      $('#imgcontainerFRONT').addClass('invisible');
      $('#imgcontainerFRONT').removeClass('visible');
    }
    alternanceImg =! alternanceImg
  }


  // $("#login").click(function(e) { 
  //     if (!interval) {
  //         interval = setInterval(function(){myFunction();}, 2000); 
  //     }
  // });

  // $("#logout").click(function(e) { 
  //     clearInterval(interval); 
  //     interval = null;
  // });

  em.addListener('salmstartstream', startTheStream);

  function startTheStream(what) {

    console.log('salm startstream!', what, streaming);

    var body = { "request": "watch", id: parseInt(1) };
    streaming.send({"message": body});

    if (!streamCheckInterval) {
        streamCheckInterval = setInterval(function(){checkTheStream();}, 5000); 
    }
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

  function checkTheStream(){
    console.log('checkTheStream!');
    if(!streaming) Janus.init();
    startTheStream();
  }

});



Template.jacky.events({

  'click #cuppasInc': function(){
  //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
  Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
  },

  'click #cuppasDec': function(){
    Meteor.call('setSuperGlobal', {name: 'cuppasDec'});
  },

  'click #oui': function(){
    console.log('salmclick oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'oui' });
    em.emit('salmclick');
    console.log('salmclick emmited');
    console.log('salmclick emmited oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #non': function(){
    console.log('salmclick non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'non' });
    em.emit('salmclick');
    console.log('salmclick emmited non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #euh': function(){
    console.log('salmclick euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'euh' });
    em.emit('salmclick');
    console.log('salmclick emmited euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  }

})

  function balayeurfunc(){
          $( ".eclair" ).remove();
          $( ".eclair2" ).remove();
  }
