var streamCheckInterval;

Template.training.events({

  'click #cuppasInc': function(){
  //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
  Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
  },

  'click #cuppasDec': function(){
    Meteor.call('setSuperGlobal', {name: 'cuppasDec'});
  },

  'click #finishCuppa': function(){
    Meteor.call('setSuperGlobal', {name: 'finishCuppa'});
  },
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


Template.training.onRendered(function () {

  em.addListener('salmtheoneshow-single-training', showTheOneButtonsSingleTraining);
  em.addListener('salmtheoneshow-multi-training', showTheOneButtonsMultiTraining);
  em.addListener('salmtheonehide-training', hideTheOneButtonsTraining);

  function showTheOneButtonsSingleTraining(){

    // if(Roles.userIsInRole(Meteor.user(), "jacky_one")==true) {
      console.log('showTheOneButtons');
      $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
      $('#sacbouttons').removeClass('invisible');
      $('#sacbouttons').addClass('visible');
    // }

  }
  function showTheOneButtonsMultiTraining(){

    // if(Roles.userIsInRole(Meteor.user(), "jacky_one")==true) {
      console.log('showTheOneButtons');
      $('<button id="ouiMP" class="button">oui</button><button id="nonMP" class="button">non</button><button id="euhMP" class="button">euh</button>').appendTo('#sacbouttons');
      $('#sacbouttons').removeClass('invisible');
      $('#sacbouttons').addClass('visible');
    // }

  }


  function hideTheOneButtonsTraining(){
    console.log('hideTheOneButtonsTraining?');
    $('#oui, #non, #euh').hide();
    $('#sacbouttons input, #sacbouttons button').hide();
  }



  //streaming janus
  var server = null;
  // if(window.location.protocol === 'http:')
  //     server = "http://" + window.location.hostname + ":8088/janus";
  // else
  //     server = "https://" + window.location.hostname + ":8089/janus";

  // var host = window.location.hostname == "localhost" ? "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com" : window.location.hostname;
  // var host = window.location.hostname == "localhost" ? "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com" : window.location.hostname;
  var host = "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com";
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
              // var isPowerToThePeople = getSuperGlobal("powerToThePeople", false); // par défaut false, admin a le pouvoir -> donc lancer le stream (?)
              // if(!isPowerToThePeople) {
                // console.log("le pouvoir est déjà aux mains de l'admin lancons le stream au chargement de la page");
                startTheStream();
              // }

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



  function startTheStream(what) {

    console.log('salm startstream!', what, streaming);

    var body = { "request": "watch", id: parseInt(1) };
    streaming.send({"message": body});

    if (!streamCheckInterval) {
        streamCheckInterval = setInterval(function(){checkTheStream();}, 30000); 
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
    if(!Janus.initDone || !streaming) Janus.init();
    if(!streaming.webrtcStuff.started) startTheStream();
  }



});