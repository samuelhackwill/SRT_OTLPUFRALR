
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

// ICI TOUS LES EVENEMENTS DE DDP
if (Meteor.isServer) {
  process.env.HTTP_FORWARDED_COUNT = 1;
  Meteor.publish(null, function() {
    return [
      Meteor.users.find({
        "status.online": true
      }, {
        fields: {
          status: 1,
          username: 1
        }
      }), UserStatus.connections.find()
    ];
  });


  UserStatus.events.on("connectionLogin", function(fields) { console.log("connectionLogin", fields); });

  em.addListener('salmclick', function(/* client */) {
    console.log('HELLO', _.toArray(arguments), arguments[0].reponse, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    // em.setClient({ reponse: arguments[0].reponse });
    var reponse = arguments[0].reponse;
    if(reponse) {
      console.log('emit salmreponse '+reponse, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      em.emit('salmreponse'+reponse);
    }
  });



  em.addListener('adminnext', function(/* client */) {
    console.log('ADMIN NEXT', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      em.emit('salmnext', args);
    }
  });

  em.addListener('ca_va_peter', function(/* client */) {
    console.log("ca_va_peter cote serveur");
    em.emit('ca_va_peter_client')
  });

  em.addListener('adminstartstream', function(/* client */) {
    console.log('ADMIN START STREAM', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      em.emit('salmstartstream', args);
    }
  });

  em.addListener('adminshowtheone', function(/* client */) {
    console.log('ADMIN SHOW THE ONE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmtheoneshow');
    // }
  });
  em.addListener('adminhidetheone', function(/* client */) {
    console.log('ADMIN HIDE THE ONE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmtheonehide');
    // }
  });



  /*em.addListener('adminswitchthepower', function() {
    console.log('ADMIN SWITCH THE POWER', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmswitchthepower');
    // }
  });*/
  em.addListener('adminrefreshpage', function(/* client */) {
    console.log('ADMIN REFRESH PAGE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmrefreshpage');
    // }
  });


  em.addListener('adminForceGoTo', function(/* client */) {
    console.log('ADMIN FORCE GO TO', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      em.emit('salmForceGoTo', args);
    }
  });


  


  
  // This code only runs on the server
  Meteor.publish('superGlobals', function tasksPublication() {
    return superGlobals.find();
  });

  Meteor.methods({
    startTheStream: function(){
      // superGlobals.upsert('streamStarted', { $set: { value: true, time: Date.now() } });
    },
    isTheStreamStarted: function(){
      return superGlobals.find();
    },
  });

  console.log('SERVER', this.UserConnections, UserStatus, UserStatus.connections);

  // UserStatus.connections.before.upsert(function (userId, selector, modifier, options) {
  //   console.log("before upsert", userId, selector, modifier, options);
  //   // modifier.$set = modifier.$set || {};
  //   // modifier.$set.modifiedAt = Date.now();
  // });
}


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
          
        case 'SUPERinterrupt':
          console.log('SUPERinterrupt', obj.value);
          // if(typeof(obj.value) === "boolean") {
          if( Object.prototype.toString.call( obj.value ) === '[object Array]' ) { //check si c'est un array
            console.log('SUPERinterrupt2', obj.value, superGlobals.findOne({ SUPERinterrupt: { $exists: true}}));
            var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
            if(SUPERinterrupt) {
              console.log('SUPERinterrupt3 mise a jour');
              //mise à jour
              superGlobals.update(SUPERinterrupt._id, { $set: {SUPERinterrupt: obj.value} }, { filter: false });
            } else {
              console.log('SUPERinterrupt3 insert!');
              //création
              superGlobals.insert({SUPERinterrupt: obj.value}, { filter: false });

            }
            // superGlobals.upsert({modeSpectacle: obj.value}, { filter: false });
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

        case 'spectacleStarted':
          console.log('spectacleStarted', obj.value);
          if(typeof(obj.value) === "boolean") {
            console.log('spectacleStarted2', obj.value, superGlobals.findOne({ spectacleStarted: { $exists: true}}));
            var spectacleStarted = superGlobals.findOne({ spectacleStarted: { $exists: true}});
            if(spectacleStarted) {
              console.log('spectacleStarted3 mise a jour');
              //mise à jour
              superGlobals.update(spectacleStarted._id, { $set: {spectacleStarted: obj.value} }, { filter: false });
            } else {
              console.log('spectacleStarted3 insert!');
              //création
              superGlobals.insert({spectacleStarted: obj.value}, { filter: false });

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
            superGlobals.insert({cuppasCount: 1}, { filter: false });
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
            //création
            superGlobals.insert({cuppasCount: 0}, { filter: false });
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

          break

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
  },
  /*createCompteurFromAdmin: function(compteurName){
    console.log('createCompteurFromAdmin', compteurName);


    var compteurs = superGlobals.findOne({ compteurs: { $exists: true}});
    if(compteurs) {
      console.log('spectacleStarted3 mise a jour');
      //mise à jour
      superGlobals.update(spectacleStarted._id, { $set: {spectacleStarted: obj.value} }, { filter: false });
    } else {
      console.log('spectacleStarted3 insert!');
      //création
      superGlobals.insert({spectacleStarted: obj.value}, { filter: false });

    }

    var id = Accounts.createUser({ email: email, password: password });
    console.log('Accounts.createUser', id);
    if (role != '' && role != 'admin') {
      // Need _id of existing user record so this call must come
      // after `Accounts.createUser` or `Accounts.onCreate`
      console.log('addUsersToRoles', role);
      Roles.addUsersToRoles(id, [role]);
    }
  }*/


});
