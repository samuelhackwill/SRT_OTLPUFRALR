// import Parser from 'simple-text-parser2';

Template.representations.onCreated(function() {

  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('allRepresentations');
  });

});

Template.representations.onRendered(function () {
  $(document.body).addClass('representations');
  console.log('welcome to representations!');
  // // this.
  // $('.datetimepicker').datetimepicker({
  //   locale: "fr"
  // });
  // $('#representation-date_start').datepicker();
});




Template.representations.helpers({

  listRepresentations:function(){
    console.log("listRepresentations??");
    return representations.find();
  },

  representationArray: function (obj) {
    var arr = [], datas = obj;
    for (var key in datas) {
        var obj = {};
        obj.key = key;
        obj.value = datas[key];
        arr.push(obj);
    }
    return arr;
  },
  countParticipants: function (obj){
    console.log("countParticipants", obj);
    if(obj) return Object.keys(obj).length;
    else return 0;
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
    return Session.equals('editItemId', this._id);
  } 

});


var saveItem = function(){
  var editItem = {
    
    name: $("#editItemName").val(),
    location: $("#editItemLocation").val(),
    date_start: moment($("#editItemDateStart").val(), "YYYY-MM-DD HH:mm").toDate(),
    date_end: moment($("#editItemDateEnd").val(), "YYYY-MM-DD HH:mm").toDate(),
    anonymousParticipants: $("#editItemAnonymousParticipants").val(),
    status: $("#editItemStatus").val()
  }
  var args = {
    _id: Session.get('editItemId'),
    obj: editItem
  }
  Meteor.call('editRepresentation', args);
  // Items.update(Session.get('editItemId'), {$set: editItem});
  Session.set('editItemId', null);
}


Template.representations.events({
    // 'click #text-to-json': function(event) {
    //   console.log('text-to-json!');
    //   event.preventDefault();
    //   rawTextToJson();
    // },
    'click #addRepresentation': function(event) {
      console.log('addRepresentation!');
      event.preventDefault();
      var representationNom = $('#representation-name').val();
      var representationLieu = $('#representation-location').val();
      var representationDebut = $('#representation-date_start').val();
      var representationFin = $('#representation-date_end').val();
      var representationStatut = $('#representation-status').val();
      if(
        representationNom != "" &&
        representationLieu != "" &&
        representationDebut != "" &&
        representationFin != "" &&
        representationStatut != ""
      ) {
        // var contenuData = $('#json-result').val();
        var args = {
          name: representationNom,
          location: representationLieu,
          date_start: moment(representationDebut, "YYYY-MM-DD HH:mm").toDate(),
          date_end: moment(representationFin, "YYYY-MM-DD HH:mm").toDate(),
          status: representationStatut
        };
        console.log('representation : ', args);
        Meteor.call('newRepresentation', args);
      } else {
        alert("il y a un champ non renseigné.");
      }
    },


    // 'click .deleteItem': function(){
    //   Items.remove(this._id);
    // },
    'click .editItem': function(){
      Session.set('editItemId', this._id);
    },
    'click .cancelItem': function(){
      Session.set('editItemId', null);
    },
    'click .saveItem': function(){
      saveItem();
    },
    'keypress input': function(e){
      if(e.keyCode === 13){
        saveItem();
      }
      else if(e.keyCode === 27){
        Session.set('editItemId', null);
      }
    }
});