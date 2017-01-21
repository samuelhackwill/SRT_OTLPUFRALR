Router.route('/', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
      console.log("modeSpectacle??", modeSpectacle);
      if(modeSpectacle) this.render('jacky');
      else this.render('home');
      // this.render('waiting');
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
// Router.route('/oui-non-euh-client');
// Router.route('/spectacle');
Router.route('/jacky');


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
  // console.log("phone:"+phone);
  // console.log("phone:"+phone.replace(/[^\dx]/gm, ""));
  var passes = regexPhone.test(phone.replace(/[^\dx]/gm, ""));

  if (passes) {

    var args = { number: phone };
    var phoneNumber = PhoneNumbers.findOne(args);
    // console.log(PhoneNumbers.find().fetch());
    console.log("getPhone phoneNumber exists ?", phoneNumber);
    // var gotoId = phoneNumber ? "help" : "main";
    var gotoId = phoneNumber ? "main" : "main";
    this.response.end('<?xml version="1.0" encoding="UTF-8"?><vxml version="2.0" xmlns="http://www.w3.org/2001/vxml" xml:lang="fr-FR">    <form id="phoneNumber">      <block name="tech">        <goto next="/svi/test.vxml#'+gotoId+'" />      </block>    </form></vxml>');
    // this.response.end('post request\nphone valid : '+phone+'\n');
    console.log('addPhoneNumber : ', args);
    Meteor.call('addPhoneNumber', args);
    
  } else {
    // this.response.end('post request\nphone not valid : '+phone+'\n');
    this.response.end();
  }
});
