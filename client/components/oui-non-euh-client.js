Template.ouiNonEuhClient.onRendered(function () {
  console.log('oui non euh!!');
});

Template.ouiNonEuhClient.events({

  'click #oui': function(){
    em.setClient({ reponse: 'oui' });
    em.emit('salmclick');
    console.log('salmclick emmited');
    console.log('salmclick emmited oui');
  },
  'click #non': function(){
    em.setClient({ reponse: 'non' });
    em.emit('salmclick');
    console.log('salmclick emmited non');
  },
  'click #euh': function(){
    em.setClient({ reponse: 'euh' });
    em.emit('salmclick');
    console.log('salmclick emmited euh');
  }

})