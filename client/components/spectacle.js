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
    console.log("spectacle autorun admin", Template.instance());
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    console.log('srt spectacle rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    console.log("isItPowerToThePeople", isItPowerToThePeople);
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
  });


  em.addListener('salmnext', function(what) {
    console.log('salm next!', what);
    // compteur = what.compteur;
    var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : [];
    console.log("salm next : isSUPERinterrupt", isSUPERinterrupt);
    var found = jQuery.inArray('salm', isSUPERinterrupt);
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


  /*em.addListener('salmswitchthepower', function(what) {
    console.log('salm switch the power!', what);
    // compteur = what.compteur;
    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    console.log('salm doYouHavePower ?', isItPowerToThePeople);
    console.log('salm interrupt ?', interrupt);
    // interrupt = !isItPowerToThePeople;
    switchThePower(!isItPowerToThePeople);
  }); */

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

  var host = window.location.hostname == "localhost" ? "ontraverseralepont.com" : window.location.hostname;
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


  $(document.body).on('keyup', function(e) {

    e = e || window.event
    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : false
    console.log('spectacle keyup compteur = ', compteur, 'interrupt = ', interrupt, 'isItPowerToThePeople = ', isItPowerToThePeople, 'isSUPERinterrupt = ', isSUPERinterrupt);
    if(e.keyCode =='32' && compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true && isSUPERinterrupt == false){
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

switchThePower = function(toWhat){

  console.log('salm switchThePower toWhat', toWhat);
  console.log('salm interrupt is ', interrupt);
  interrupt = toWhat;
  console.log('salm interrupt is ', interrupt);
}

Template.spectacle.events({

    'click #cuppasInc': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
    },

    'click #cuppasDec': function(){
      Meteor.call('setSuperGlobal', {name: 'cuppasDec'});
    },

    'touchstart #gcontainer': function(){
      compteur+=1;
      next();
    }

})

// TO DO
// balises pour afficher du texte ailleurs que dans SRT (checklist, rubrique fiction)

// var compteurquest = -1
// var compteur = -1
// // ça c'est pour commencer au 0 du tableau.
// var interrupt = false
// var indeximg = 0
// var alternance = false
// var autonextcontainer
// var flipbookstatus = false

// // var data = data;

// var posanswers =["disponible", "à la maison", "tranquille", "son ok", "concentré"]
// var neganswers =["occupé","en ville","pas seul", "mute", "distrait"]
