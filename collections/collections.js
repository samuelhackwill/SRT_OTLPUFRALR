superGlobals = new Meteor.Collection('superGlobals');

ContenusEcran = new Meteor.Collection('contenusEcran');

representations = new Meteor.Collection('representations');

PhoneNumbers = new Meteor.Collection('phoneNumbers');

var Schemas = {};

Schemas.ContenusEcran = new SimpleSchema({

    name: {
          type: String,
          label: "Nom",
          max: 200
    },
    text: {
          type: String,
          label: "Texte"
    },
    "data": {
        type: [Object],
        label: "Données",
        blackbox: true
    },
    "data.$.type": {
        type: String,
        label: "Type du blob de donnée"
    },
    "created": {
      type: Date,
      label: "Date de création",
      autoValue: function() {
        if ( this.isInsert ) {
          return new Date;
        } 
      }
    },
    "updated": {
      type: Date,
      label: "Date de modification",
      autoValue: function() {
        if ( this.isUpdate || this.isInsert || this.isInsert ) {
          return new Date;
        } 
      }
    }

});


Schemas.superGlobals = new SimpleSchema({

    powerToThePeople: {
      type: Boolean,
      label: "Pouvoir au peuple, les SALM dirigent le déroulé (barre espace)",
      optional: true
    },

    SUPERinterrupt: {
      type: Boolean,
      label: "bloquer l'action next (barre espace) pour les SALM",
      optional: true
    },

    modeSpectacle: {
      type: Boolean,
      label: "Quand le spectacle va commencer ou commence",
      optional: true
    },

    spectacleStarted: {
      type: Boolean,
      label: "Quand le spectacle a commencé",
      optional: true
    },

    cuppasCount: {
      type: Number,
      label: "Le nombre de tasses de thé fumantes chez les PALMES",
      optional: true,
    }

});


Schemas.representations = new SimpleSchema({

    name: {
          type: String,
          label: "Nom",
          max: 200
    },
    location: {
          type: String,
          label: "Lieu",
          max: 200
    },
    "date_start": {
      type: Date,
      label: "Date et heure de Début"
    },
    "date_end": {
      type: Date,
      label: "Date et heure de Fin"
    },
    "status": {
      type: String,
      label: "Statut",
      max: 200
    },
    "participants": {
      type: Object,
      label: "Participants",
      optional: true
    },
    "anonymousParticipants": {
        type: Number,
        label: "Participants anonymes",
        defaultValue: 0
    },
    "created": {
      type: Date,
      label: "Date de création",
      autoValue: function() {
        if ( this.isInsert ) {
          return new Date;
        } 
      }
    },
    "updated": {
      type: Date,
      label: "Date de modification",
      autoValue: function() {
        if ( this.isUpdate || this.isInsert || this.isInsert ) {
          return new Date;
        } 
      }
    }

});


Schemas.phoneNumbers = new SimpleSchema({

    "number": {
        type: String,
        label: "Numéro de téléphone"
    },
    "calls": {
        type: Number,
        label: "Appels",
        defaultValue: 0
    },
    "created": {
      type: Date,
      label: "Date de création",
      autoValue: function() {
        if ( this.isInsert ) {
          return new Date;
        } 
      }
    },
    "updated": {
      type: Date,
      label: "Date de modification",
      autoValue: function() {
        if ( this.isUpdate || this.isInsert || this.isInsert ) {
          return new Date;
        } 
      }
    }

});

//attachons les schema à nos collections
ContenusEcran.attachSchema(Schemas.ContenusEcran);
superGlobals.attachSchema(Schemas.superGlobals);
representations.attachSchema(Schemas.representations);
PhoneNumbers.attachSchema(Schemas.phoneNumbers);


//permissions
ContenusEcran.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});

superGlobals.allow({
  insert: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  },
  update: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});


//permissions
representations.allow({
  insert: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  update: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});


//permissions
PhoneNumbers.allow({
  insert: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  update: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});

Meteor.users.allow({
  remove: function (userId, doc) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true;
  }
});