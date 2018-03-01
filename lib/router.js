Router.route('/', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return [Meteor.subscribe('superGlobals'), Meteor.subscribe('allRepresentations')];
  },

  action: function () {
    if(this.ready()) {
      balisesVue = ["NL_SALM", "NL_CYCLO", "NL", "FR_CYCLO", "EN_SALM", "EN_CYCLO", "EN", "FR_INTR", "NL_INTR", "DE_INTR", "EN_INTR", "DE_SALM", "DE_CYCLO", "DE"]
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      //checkons si il y a le cookie
      var checkCookie = cookies.get("user_represent");
      var checkCookieLan = cookies.get("user_lan");

      console.log("router - checkCookie??", checkCookie, cookies);
      // console.log("router - checkUserLan??", checkCookieLan);
      // if (checkCookieLan) {
      //   // là ils ont un cookie langue (on a un des clics sur le drapeau ou quoi)
      //   TAPi18n.setLanguage(checkCookieLan)        
      // }else{
      //   // là ils ont jamais cliqué sur rien donc faut inférer leur langue ET créer un cookie mvoyez)
      //   $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
      //   // console.log("COUNTRY IS ",data.countryCode)
      //   localCountry = data.countryCode
      //   // console.log("CITY IS ",data.city)
      //   // console.log("REGION NAME IS ",data.regionName)
      //   console.log("le pays c'est ",localCountry.toLowerCase())
      //   cookies.set("user_lan", localCountry.toLowerCase())
      //   });
      // }
      if(modeSpectacle) { //le spectacle va bientôt commencer ou a déjà commencé
        //récupérons la representation du jour
        var now = new Date();
        todayStart = new Date(now.setHours(0,0,0,0));
        todayEnd = new Date(now.setHours(24,0,0,0));
        console.log("router - today is between", todayStart, todayEnd);
        var foundRepresentation = representations.findOne({ 
          date_start: { 
            $gte: todayStart,
            $lt: todayEnd
          },
          "status": /(pending|running)/
        }, {sort: {date_start: 1}});
        if(foundRepresentation) { //representation du jour trouvée
          console.log("router - representation du jour trouvée");
          var currentRepresentation = foundRepresentation._id;
          if(null != checkCookie && undefined != checkCookie && checkCookie == currentRepresentation) {
            console.log("router - la personne a déjà choisi le spectacle du jour !");
            //la personne a déjà choisi le spectacle du jour !
            this.render('spectacle');
          } else this.render('waiting');
        } else this.render('waiting');
        console.log("router - representation?", currentRepresentation, foundRepresentation.name);
      } 
      else this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});

Router.route('/login');

Router.route('/admin',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      else{
          this.next();
      }
    balisesVue = ["FR_CYCLO", "FR_SALM", "FR_DECR", "FR_INTR"]
  }
});


Router.route('/pupitre',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      else{
          this.next();
      }
    balisesVue = ["FR"]
  }
});

Router.route('/adminBabySit',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});

Router.route('/data',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});

Router.route('/representations',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          console.log("redirect?!");
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});
Router.route('/ambiances',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          console.log("redirect?!");
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});
Router.route('/users',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          console.log("redirect?!");
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});
Router.route('/spectacle', {
  subscriptions: function() {
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      if(modeSpectacle) this.render('spectacle');
      else this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});

Router.route('/plateau');


Router.route('/nlsat', {
  subscriptions: function() {
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      balisesVue = ["NL_SAT", "NL", "EN_SAT", "EN", "DE_SAT", "DE"]
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      if(modeSpectacle) this.render('nlsat');
      else this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});



Router.route('/videoproj', {
  subscriptions: function() {
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      // là tu peux mettre autant de langues que tu veux au final
      // comme au kunst où le videoproj était bilingue
      balisesVue = ["FR_CYCLO"]
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      if(modeSpectacle) this.render('videoproj');
      else this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});

Router.route('/english_beta', {
  subscriptions: function() {
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      balisesVue = ["EN_SALM", "EN_CYCLO", "EN", "EN_INTR", "EN_SAT"]
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);

      // bon normalement on a plus besoin de tout ça

      TAPi18n.setLanguage("en")
      
      var zoupla = setTimeout(function(){
        // window.document.body.getElementsByTagName('span')[0].style.display="none"
        // document.getElementbyId("nlsrt").innerHTML = "Put your browser in full screen mode (try to zoom in the page a bit and pull it upward), and adjust the siplay brightness so that it's not too bright."
        // document.getElementbyId("imgcontainerBACK").style.opacity="0"
        // document.getElementbyId("imgcontainerFRONT").style.opacity="0"

        alert("Ok, great! \nIf you're reading this, it should be working. You won't have anything to do, the subtitles will display automatically. \n\nDisclaimer : this is a temporary English translation not made by trained professionals.")
      // hack pété pour empêcher les gens de changer de langue parce que après ils pourraient 
      // plus repasser en anglais hé ouais
      },750)

      var mute = setTimeout(function(){
        var vid = document.getElementById("stream-video");
        vid.muted = true;
      // hack pété n°2 pour muter le stream audio et cacher les ambiances. Hé ben bravo Niels
      },400)

      if(modeSpectacle) this.render('ensat');
      else this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});

//phones
Router.route('/getPhone', {where: 'server'})
.get(function () {
    this.response.end('get request\n');
    console.log("this.request", this.request);
})
.post(function () {
  console.log("this.params", this.params);
  console.log("this.request", this.request);

  var phone = this.request.body.phone;
  var regexPhone = /^(\+?[\dx]+)$/;
  var passes = regexPhone.test(phone.replace(/[^\dx]/gm, ""));

  if (passes) {

    var currentRepresentation = null;
    modeSpectacle = getSuperGlobal("modeSpectacle");
    if(modeSpectacle) { //le spectacle va bientôt commencer ou a déjà commencé
      //récupérons la representation du jour
      var now = new Date();
      todayStart = new Date(now.setHours(0,0,0,0));
      todayEnd = new Date(now.setHours(24,0,0,0));
      console.log("router checkPhone - today is between", todayStart, todayEnd);
      var foundRepresentation = representations.findOne({ 
        date_start: { 
          $gte: todayStart,
          $lt: todayEnd
        },
        "status": /(pending|running)/
      }, {sort: {date_start: 1}});
      console.log("router checkPhone - representation?", foundRepresentation);
      if(foundRepresentation) { //representation du jour trouvée
        console.log("router checkPhone - representation du jour trouvée");
        var currentRepresentation = foundRepresentation._id;
        console.log("router checkPhone - representation?", currentRepresentation);
      }
    }

    var args = { number: phone };
    if(currentRepresentation) args.representation = currentRepresentation;
    var phoneNumber = PhoneNumbers.findOne(args);
    console.log("getPhone phoneNumber exists ?", phoneNumber);
    var gotoId = phoneNumber ? "main" : "main";
    this.response.end('<?xml version="1.0" encoding="UTF-8"?><vxml version="2.0" xmlns="http://www.w3.org/2001/vxml" xml:lang="fr-FR">    <form id="phoneNumber">      <block name="tech">        <goto next="/svi/test.vxml#'+gotoId+'" />      </block>    </form></vxml>');
    console.log('addPhoneNumber : ', args);
    Meteor.call('addPhoneNumber', args);
    
  } else {
    this.response.end();
  }
});