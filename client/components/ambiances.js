// import Parser from 'simple-text-parser2';

Template.ambiances.onCreated(function() {

  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('allAmbiances');
  });

});

Template.representations.onRendered(function () {
  $(document.body).addClass('ambiances');
  console.log('welcome to ambiances!');
  // // this.
  // $('.datetimepicker').datetimepicker({
  //   locale: "fr"
  // });
  // $('#representation-date_start').datepicker();
});



Template.ambiances.helpers({

  listAmbiances:function(){
    console.log("listAmbiances??");
    return ambiances.find();
  },

  ambiancesArray: function (obj) {
    var arr = [], datas = obj;
    for (var key in datas) {
        var obj = {};
        obj.key = key;
        obj.value = datas[key];
        arr.push(obj);
    }
    return arr;
  },
  quickRemoveButtonOnError: function () {
    return function (error) { alert("BOO!"); console.log(error); };
  },
  quickRemoveButtonOnSuccess: function () {
    return function (result) { alert("YAY!"); console.log(result); };
  },
  quickRemoveButtonBeforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.name + '"?')) {
        this.remove();
      }
    };
  },

  editing: function(){
    return Session.equals('editAmbianceId', this._id);
  } 

});


var saveItemAmbiance = function(){
  var editItem = {
    name: $("#editItemName").val(),
    fadein: $("#editItemValue").val(),
    cue: $("#editItemCue").val(),
    chemin: $("#editItemChemin").val()
  }
  var args = {
    _id: Session.get('editAmbianceId'),
    obj: editItem
  }
  Meteor.call('editAmbiance', args);
  // Items.update(Session.get('editAmbianceId'), {$set: editItem});
  Session.set('editAmbianceId', null);
}


Template.ambiances.events({
    // 'click #text-to-json': function(event) {
    //   console.log('text-to-json!');
    //   event.preventDefault();
    //   rawTextToJson();
    // },
    'click #addAmbiance': function(event) {
      console.log('addAmbiance!');
      event.preventDefault();
      var ambianceNom = $('#ambiance-name').val();
      var ambianceValue = $('#ambiance-value').val();
      var ambianceCue = $('#ambiance-cue').val();
      var ambianceChemin = $('#ambiance-chemin').val();
      if(
        ambianceNom != "" && ambianceValue != "" && ambianceCue != "" && ambianceChemin != ""
      ) {
        // var contenuData = $('#json-result').val();
        var args = {
          name: ambianceNom,
          value: ambianceValue,
          cue: ambianceCue,
          chemin: ambianceChemin
        };
        console.log('ambiance : ', args);
        Meteor.call('newAmbiance', args);
      } else {
        alert("il y a un champ non renseigné.");
      }
    },


    // 'click .deleteItem': function(){
    //   Items.remove(this._id);
    // },
    'click .editItem': function(){
      Session.set('editAmbianceId', this._id);
    },
    'click .cancelItem': function(){
      Session.set('editAmbianceId', null);
    },
    'click .saveItem': function(){
      saveItemAmbiance();
    },
    'keypress input': function(e){
      if(e.keyCode === 13){
        saveItemAmbiance();
      }
      else if(e.keyCode === 27){
        Session.set('editAmbianceId', null);
      }
    }
});