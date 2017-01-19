
// ContenusEcran.before.insert(function (userId, doc) {
//   doc.createdAt = new Date();
// });

Meteor.publish('allContenusEcran', function () {
  return ContenusEcran.find();
});
Meteor.publish('allSuperGlobals', function () {
  return superGlobals.find();
});
Meteor.publish('allRepresentations', function () {
  return representations.find();
});
Meteor.publish('allPhoneNumbers', function () {
  return PhoneNumbers.find();
});

Meteor.publish( 'users', function() {
  let isAdmin = Roles.userIsInRole( this.userId, 'admin' );

  if ( isAdmin ) {
    return Meteor.users.find( {}, { fields: { "emails.address": 1, "roles": 1 } } )
  } else {
    return null;
  }
});


Meteor.methods({

  /**
  * enregistre un nouveau contenu écran
  *
  * @method newContenuEcran
  * @param {String} name Nom du contenu écran
  * @param {String} data Données du contenu écran
  */
  newContenuEcran: function (obj) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    //check si deja enregistré
    var data = tryParseJSON(obj.data);
    if(data) {
    
      console.log(typeof obj.name, obj.name);
      console.log('valid JSON?'); 
      console.log(typeof data);
      console.log(data instanceof Object);

      var contenuEcran = ContenusEcran.findOne({name: obj.name});
      console.log("contenuEcran existe ?", contenuEcran);
      
      if(contenuEcran) {
        console.log("contenuEcran existe. mise à jour.");
        ContenusEcran.update(contenuEcran._id, { 
          $set: {
            name: obj.name, 
            data: data, 
            text: obj.text 
          }
        }, { filter: false });
      } else {
        console.log("nouveau contenuEcran. insertion");
        // var copie = Object.assign({}, data);
        // console.log('true Object?'); 
        // console.log(typeof copie);
        // console.log(copie instanceof Object);
        // console.log(copie);
        // insertion du nouveau contenu écran
        ContenusEcran.insert({name: obj.name, data: data, text: obj.text}, { filter: false });  
      }
      
    }
  },
  setSuperGlobal: function(obj) {
    console.log('setSuperGlobal', obj);
    if(obj.name) {
      switch(obj.name) {
        case 'powerToThePeople':
          console.log('powerToThePeople', obj.value);
          if(typeof(obj.value) === "boolean") {
            console.log('powerToThePeople2', obj.value, superGlobals.findOne({ powerToThePeople: { $exists: true}}));
            var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
            if(powerToThePeople) {
              console.log('powerToThePeople3 mise a jour');
              //mise à jour
              superGlobals.update(powerToThePeople._id, { $set: {powerToThePeople: obj.value} }, { filter: false });
            } else {
              console.log('powerToThePeople3 insert!');
              //création
              superGlobals.insert({powerToThePeople: obj.value}, { filter: false });

            }
            // superGlobals.upsert({powerToThePeople: obj.value}, { filter: false });
          }
          break;
        case 'modeSpectacle':
          console.log('modeSpectacle', obj.value);
          if(typeof(obj.value) === "boolean") {
            console.log('modeSpectacle2', obj.value, superGlobals.findOne({ modeSpectacle: { $exists: true}}));
            var modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}});
            if(modeSpectacle) {
              console.log('modeSpectacle3 mise a jour');
              //mise à jour
              superGlobals.update(modeSpectacle._id, { $set: {modeSpectacle: obj.value} }, { filter: false });
            } else {
              console.log('modeSpectacle3 insert!');
              //création
              superGlobals.insert({modeSpectacle: obj.value}, { filter: false });

            }
            // superGlobals.upsert({modeSpectacle: obj.value}, { filter: false });
          }
          break;

        case 'cuppasInc':
          var thecuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
          if(thecuppasCount){
            if(thecuppasCount.cuppasCount || thecuppasCount.cuppasCount < 1) {
              console.log('un thé supplémentaire en cours de préparation');
              console.log(thecuppasCount)
              //mise à jour
              superGlobals.update(thecuppasCount._id, { $inc: { "cuppasCount": 1 } }, { filter: false });
            }
          } else {
            console.log('le premier thé est en cours de préparation');
            //création
            superGlobals.insert({thecuppasCount: 1}, { filter: false });
          }

        break

        case 'cuppasReset':
          var thecuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
          if(thecuppasCount){
            if(thecuppasCount.cuppasCount) {
              console.log('un thé supplémentaire en cours de préparation');
              //mise à jour
              superGlobals.update(thecuppasCount._id, { $set: { "cuppasCount": 0 } }, { filter: false });
            }
            console.log('ben euh ya bien une collection mais elle est vide');
          } else {
            console.log('ben euh ya rien en fait');
          }
          
        break

        case 'cuppasDec':
          var thecuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
          if(thecuppasCount){
            if(thecuppasCount.cuppasCount && thecuppasCount.cuppasCount > 0) {
              console.log('un thé supplémentaire en cours de préparation');
              //mise à jour
              superGlobals.update(thecuppasCount._id, { $inc: { "cuppasCount": -1 } }, { filter: false });
            }
          } else {
            console.log('on peut pas enlever des thés parce que yen a pas');
            //création
          }

        default:
          break;
      }
    }
  },

  /**
  * enregistre une nouvelle représentation
  *
  * @method newRepresentation
  * @param {Object} name, location, date_start, date_end, status
  */
  newRepresentation: function (obj) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    console.log("newRepresentation", obj);
    representations.insert(obj, { filter: false });
  },
  addUserToRepresentation: function (obj) {
    console.log("addUserToRepresentation", obj);
    if(obj._id) {

      if(obj.userId) {
        participants = representations.findOne({ "_id": obj._id, "participants.userId": obj.userId});
        //logged user
        console.log("logged user", participants);

        // participants.push({userId: obj.userId});
      } else {
        anonParticipants = representations.findOne(
          { "_id": obj._id },
          { "anonymousParticipants": 1 }
        );
        console.log("anonymous user", anonParticipants);
        if(anonParticipants) {
          representations.update(
            { "_id": obj._id }, 
            { $inc: { "anonymousParticipants": 1 }}
          );
        } else {
          representations.updateOne(obj._id, 
            { "_id": obj._id, "participants.anonymous": {$exists: false}}, 
            { $set: { "participants.anonymous": 1 }}, { filter: false }
          );
        }

      }
      if(obj.old_representation) {
        console.log("remove from old representation", obj.old_representation);
        representations.update(
          { "_id": obj.old_representation }, 
          { $inc: { "anonymousParticipants": -1 }}
        );
      }
      representations.update(obj._id, {
        $set: { checked: ! this.checked },
      });
    }
  },
  addPhoneNumber: function (obj) {
    // var loggedInUser = Meteor.user()

    // if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
    //   throw new Meteor.Error(403, "Access denied")
    // }
    console.log("addPhoneNumber", obj);
    var phoneNumber = PhoneNumbers.findOne(obj);
    console.log("phoneNumber exists ?", phoneNumber);
    if(phoneNumber) {
      console.log("it exists already. increment number of calls");
      PhoneNumbers.update(phoneNumber._id, {
        $inc: { calls: 1 },
      });
    } else {
      PhoneNumbers.insert(obj, { filter: false });
    }
  },
  createUserFromAdmin: function(email,password,role){
    console.log('createUserFromAdmin', email,password,role);
    var id = Accounts.createUser({ email: email, password: password });
    console.log('Accounts.createUser', id);
    if (role != '' && role != 'admin') {
      // Need _id of existing user record so this call must come
      // after `Accounts.createUser` or `Accounts.onCreate`
      console.log('addUsersToRoles', role);
      Roles.addUsersToRoles(id, [role]);
    }
  }

});
