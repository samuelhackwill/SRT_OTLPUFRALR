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

});