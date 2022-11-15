Template.plateau.onCreated(function() {
  console.log('Template admin created.');
  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('allSuperGlobals');
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allLoteries');
    this.subscribe('allAmbiances');
  });

});


Template.plateau.onRendered(function () {
  console.log('Vue oui non euh!');



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

});

Template.plateau.events({

  'click #Seb' : function(){
      $('#Seb').val(getSuperGlobal("countJoined") + " SALMs")
  }
})