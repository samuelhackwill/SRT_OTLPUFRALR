Template.registerHelper('clientBrowserSupportsWebRTC', function() {
  return Janus.isWebrtcSupported();
});

Template.home.onCreated(function () {
  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
  });


});

Template.srt.helpers({

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


Template.srt.onRendered(function () {

  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"

    if(e.keyCode =='32' && compteur < data.length-1 && interrupt==false){
      window.clearTimeout(autonextcontainer)
      compteur +=1
      next();
      console.log("keyup, ", compteur)
      // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
      // ça avance tout seul avec un délai)
    }
  });

});

