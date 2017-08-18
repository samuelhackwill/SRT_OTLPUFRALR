Router.route('/', {

  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return [Meteor.subscribe('superGlobals'), Meteor.subscribe('allRepresentations')];
  },

  action: function () {
    if(this.ready()) {
      balisesVue = ["NL_SALM", "NL_CYCLO", "NL", "FR_CYCLO", "EN_SALM", "EN_CYCLO", "EN", "FR_INTR", "NL_INTR"]
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      //checkons si il y a le cookie
      var checkCookie = cookies.get("user_represent");
      console.log("router - checkCookie??", checkCookie, cookies);
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

Router.route('/ensat',{
  subscriptions: function() {
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      balisesVue = ["EN_SAT", "EN", "EN_SALM", "EN_DECR", "EN_INTR"]
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
      balisesVue = ["NL_SAT", "NL", "EN_SAT", "EN"]
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
      balisesVue = ["FR_CYCLO", "NL_CYCLO"]
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