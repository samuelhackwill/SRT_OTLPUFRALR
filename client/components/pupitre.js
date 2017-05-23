Template.registerHelper('equals', function (a, b) {
  return a == b;
});

var refreshedUp = false;

Template.pupitre.onCreated(function() {
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

Template.pupitre.onRendered(function () {
  console.log('pupitre!');
  
  $(document.body).addClass('admin');
  console.log(UserStatus);
  console.log(this.UserConnections);

  Meteor.subscribe('userStatus');
  Meteor.subscribe('allPhoneNumbers');
  Meteor.subscribe('allSuperGlobals');

  this.autorun(() => {
    console.log("showtime autorun pupitre", Template.instance());
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    if(dataPupitre.length == 0) {
      console.log('showtime retrieving dataPupitre');
      dataPupitre = ContenusEcran.findOne({name: "data_test"}).dataPupitre
    }
    console.log('showtime ContenusEcran ?', ContenusEcran.find().fetch());
    if(!refreshedUp) {
      refreshedUp = true;
      var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
      $('input#josebove').bootstrapSwitch('state', !isItPowerToThePeople, true);
      var modeSpectacle = getSuperGlobal("modeSpectacle");
      $('input#showmode').bootstrapSwitch('state', modeSpectacle, true);
      var isTheShowStarted = getSuperGlobal("spectacleStarted", false);
      $('input#startSpectacle').bootstrapSwitch('state', isTheShowStarted, true);
    }
  });



  var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
  console.log("showtime isItPowerToThePeople", isItPowerToThePeople);

  //recup compteurPupitre si on est en mode spectacle (par ex si on reload la page par inadvertance
  var modeSpectacle = getSuperGlobal("modeSpectacle");
  console.log('admin! compteurPupitre', compteurPupitreAdmin, "modeSpectacle", modeSpectacle);
  if(modeSpectacle) {
    console.log('admin! mode spectacle', compteurPupitre);
    //si on était en mode prendre le pouvoir, récupérer le compteurPupitre du cookie (= reprendre ou on en était)
    // if(!isItPowerToThePeople) { //pouvoir à l'admin

      var compteurPupitreAdmin = getSuperGlobal("compteurPupitreAdmin");
      console.log("là normalement le compteurpupitreadmin est content ",compteurPupitreAdmin)

      if(null !== compteurPupitreAdmin && compteurPupitreAdmin != compteurPupitre) {

        compteurPupitre = parseInt(compteurPupitreAdmin);


        // $('#currentCompteur').text(compteurPupitre);
        console.log('troisième occurence de compteurPupitre après parse', compteurPupitre);
      }
    // }

  } else {
    //on est pas en mode spectacle reset compteur
    Meteor.call('setSuperGlobal', {name: 'compteurPupitreAdmin', value: parseInt(compteurPupitre)});

  }
/*
  Polls.after.update(function (userId, doc, fieldNames, modifier, options) {
    em.emit('hi', userId, doc, fieldNames, modifier, options);
    console.log('after update', userId, doc, fieldNames, modifier, options);
  }, {fetchPrevious: false});
  
  */
  console.log('em', em);



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

  function pupitreAdminNext(){
    console.log('pupitreAdminNext', compteurPupitre);

      window.clearTimeout(autonextcontainer)
      compteurPupitre +=1
      var modeSpectacle = getSuperGlobal("modeSpectacle");
      var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
      var compteurPupitreAdmin = getSuperGlobal("compteurPupitreAdmin");
      console.log("adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurPupitreAdmin", compteurPupitreAdmin);
      if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurPupitreAdmin) != compteurPupitre) {
        console.log("admin next compteurPupitre set compteurPupitreAdmin", compteurPupitre)
        // cookies.set('compteurPupitreAdmin', compteurPupitre);
        Meteor.call('setSuperGlobal', {name: 'compteurPupitreAdmin', value: parseInt(compteurPupitre)});
      }
      // $('#currentCompteur').text(compteurPupitre);
      em.setClient({ compteurPupitre: compteurPupitre });
      em.emit('pupitreAdminNext');
      nlSatNext();

      majPupitreNext();
    // }
  }

    function pupitreAdminBack(){
    console.log('pupitreAdminBack', compteurPupitre);

      window.clearTimeout(autonextcontainer)
      compteurPupitre -=1
      var modeSpectacle = getSuperGlobal("modeSpectacle");
      var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
      var compteurPupitreAdmin = getSuperGlobal("compteurPupitreAdmin");
      console.log("adminPupitreNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurPupitreAdmin", compteurPupitreAdmin);
      if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurPupitreAdmin) != compteurPupitre) {
        console.log("pupitre next compteurPupitre set compteurPupitreAdmin", compteurPupitre)
        // cookies.set('compteurAdmin', compteurPupitre);
        Meteor.call('setSuperGlobal', {name: 'compteurPupitreAdmin', value: parseInt(compteurPupitre)});
      }
      // $('#currentCompteur').text(compteurPupitre);
      em.setClient({ compteurPupitre: compteurPupitre });
      em.emit('pupitreAdminBack');
      majPupitreNext();
      nlSatBack();
    // }
  }

  majPupitreNext = function(){
    //previous
      if($.isArray(dataPupitre[compteurPupitre-1].text)){
        for (var i = 0; i < dataPupitre[compteurPupitre-1].text.length; i++) {
          for(k=balisesVue.length-1; k>=0 ; k--){
            if(dataPupitre[compteurPupitre-1].text[i].hasOwnProperty(balisesVue[k])) $("#textePrevious").html(dataPupitre[compteurPupitre-1].text[i][balisesVue[k]] + " (" + dataPupitre[compteurPupitre].type +")")
          }
        }
      } else $("#textePrevious").html(dataPupitre[compteurPupitre-1].text + " (" + dataPupitre[compteurPupitre-1].type +")")
      //now
    if (undefined != dataPupitre[compteurPupitre]){
      if($.isArray(dataPupitre[compteurPupitre].text)){
        for (var i = 0; i < dataPupitre[compteurPupitre].text.length; i++) {
          for(k=balisesVue.length-1; k>=0 ; k--){
            console.log("balisesVue[k]", balisesVue[k])
            console.log("dataPupitre[compteurPupitre].text", dataPupitre[compteurPupitre].text)
            if(dataPupitre[compteurPupitre].text[i].hasOwnProperty(balisesVue[k])) $("#texteNow").html(dataPupitre[compteurPupitre].text[i][balisesVue[k]] + " (" + dataPupitre[compteurPupitre].type +")")
          }
        }
      } else $("#texteNow").html(dataPupitre[compteurPupitre].text + " (" + dataPupitre[compteurPupitre].type +")")
    } 
    //next
    if (undefined != dataPupitre[compteurPupitre+1]){
      if($.isArray(dataPupitre[compteurPupitre+1].text)){
        for (var i = 0; i < dataPupitre[compteurPupitre+1].text.length; i++) {
          for(k=balisesVue.length-1; k>=0 ; k--){
            if(dataPupitre[compteurPupitre+1].text[i].hasOwnProperty(balisesVue[k])) $("#texteNext").html(dataPupitre[compteurPupitre+1].text[i][balisesVue[k]] + " (" + dataPupitre[compteurPupitre+1].type +")")
          }
        }
      } else $("#texteNext").html(dataPupitre[compteurPupitre+1].text + " (" + dataPupitre[compteurPupitre+1].type +")")
    } else $("#texteNext").html("")
    //next next
    if (undefined != dataPupitre[compteurPupitre+2]){
      if($.isArray(dataPupitre[compteurPupitre+2].text)){
        for (var i = 0; i < dataPupitre[compteurPupitre+2].text.length; i++) {
          for(k=balisesVue.length-1; k>=0 ; k--){
            if(dataPupitre[compteurPupitre+2].text[i].hasOwnProperty(balisesVue[k])) $("#texteNextNext").html(dataPupitre[compteurPupitre+2].text[i][balisesVue[k]] + " (" + dataPupitre[compteurPupitre+2].type +")")
          }
        }
      } else $("#texteNextNext").html(dataPupitre[compteurPupitre+2].text + " (" + dataPupitre[compteurPupitre+2].type +")")
    } else $("#texteNextNext").html("")
  }

  document.onkeyup = function(e) {

    e = e || window.event
    // KEYCIODE 78 IS "n"
    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    if(!isItPowerToThePeople) {
      if(e.keyCode =='78' && compteurPupitre < dataPupitre.length-1){
        // window.clearTimeout(autonextcontainer)
        // compteurPupitre +=1
        if(nextIsBlackPupitre){
            em.emit('displayBlackPupitre')
            $('#texteNow').css("opacity", "0")
          }else{
            $('#texteNow').css("opacity", "1")
            pupitreAdminNext();
            console.log("keyup, ", compteurPupitre)
          }
          nextIsBlackPupitre = !nextIsBlackPupitre
          console.log("nextIsBlackPupitre? ",nextIsBlackPupitre)
        }
      
      if(e.keyCode =='66' && compteurPupitre > 0){
        pupitreAdminBack();
        console.log("keyup, ", compteurPupitre)
        em.emit('displayBlackPupitre')
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
}

});

Template.pupitre.helpers({
  compteurPupitreAdmin: function(){
    return getSuperGlobal('compteurPupitreAdmin');
  },
});

Template.pupitre.events({
    'click div.autofill_bookmark span': function(event){

      console.log('div.autofill_bookmark span', $(event.currentTarget).text());
      $('#whereSUPERinterrupt').val($(event.currentTarget).text());


  },

    'click #resetSUPERinterrupt': function(){
    console.log("resetSUPERinterrupt!");
    var bookmarkToGo = ($('#whereSUPERinterrupt').val() != "") ? $('#whereSUPERinterrupt').val() : 'spectacle';
    em.setClient({ bookmark: bookmarkToGo });
    em.emit('adminPupitreForceGoTo');
      gotobookmarkPUPITRE(bookmarkToGo);
  },

  'click input#setCompteur': function(){
    console.log('setCompteur', $('#adminCompteur').val());
    compteurPupitre = parseInt($('#adminCompteur').val())-1;
    //fake adminNext()
    window.clearTimeout(autonextcontainer)
    compteurPupitre +=1
    var modeSpectacle = getSuperGlobal("modeSpectacle");
    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    var compteurPupitreAdmin = getSuperGlobal("compteurPupitreAdmin");
    // console.log("adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin?", compteurAdmin);
    if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurPupitreAdmin) != compteur) {
      console.log("admin next compteur set cookie", compteur)
      // cookies.set('compteurAdmin', compteur);
      Meteor.call('setSuperGlobal', {name: 'compteurPupitreAdmin', value: parseInt(compteur)});
    }
    // $('#currentCompteur').text(compteur);
    em.setClient({ compteurPupitre: compteurPupitre });
    em.emit('pupitreAdminNext');
    next();
  }
})