superGlobals = new Meteor.Collection('superGlobals');

ContenusEcran = new Meteor.Collection('contenusEcran');

representations = new Meteor.Collection('representations');

ambiances = new Meteor.Collection('ambiances');

loteries = new Meteor.Collection('loteries');

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
    "dataPupitre":{
        type:[Object],
        label: "Données Pupitre",
        blackbox: true
    },
    "dataPupitre.$.type": {
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

    // forceHangup: {
    //   type: Boolean,
    //   label: "Quand le serveur vocal force à raccrocher après la prochaine note",
    //   optional: true
    // },

    cuppasCount: {
      type: Number,
      label: "Le nombre de volontaires PALM pour préparer une tasses de thé",
      optional: true,
    },
    
    whichAmbiance:{
      type: String,
      label: "bonne ambiance en cours",
      optional: true
    },

    nbCuppasFinished: {
      type: Number,
      label: "Le nombre de tasses de thé qui sont prêtes",
      optional: true,
    },

    buchesCount: {
      type: [Boolean],
      label: "Le nombre de bûches allumées ou pas (true/false)",
      optional: true
    },

    nextBucheAllumage: {
      type: Number,
      label: "Le prochain nombre de tasses restantes avant d'allumer la prochaine bûche",
      optional: true
    },

    compteurAdmin: {
      type: Number,
      label: "Le compteur quand l'admin prend le pouvoir",
      optional: true,
    },

    compteurPupitreAdmin: {
      type: Number,
      label: "Le compteur quand quelqu'un a besoin de surtitre les comédiens ou quoi",
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
    "contenuEcran": {
      type: String,
      label: "Contenu Écran à charger",
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


Schemas.ambiances = new SimpleSchema({

    name: {
          type: String,
          label: "Nom",
          max: 200
    },
    value: {
          type: String,
          label: "Valeur",
          max: 200
    },
    cue: {
          type: String,
          label: "Cue",
          max: 200,
          optional: true
    },
    chemin: {
          type: String,
          label: "Chemin",
          max: 200
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


Schemas.loteries = new SimpleSchema({

    name: {
      type: String,
      label: "Nom",
      max: 200
    },
    ids: {
      type: [String],
      label: "ids des participants",
      max: 200,
      optional: true
    },
    messages: {
      type: [Object],
      label: "messages à envoyer et à qui",
      max: 200,
      optional: true,
      blackbox: true
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
    "representation": {
        type: String,
        label: "representation",
        defaultValue: ""
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
ambiances.attachSchema(Schemas.ambiances);
loteries.attachSchema(Schemas.loteries);
PhoneNumbers.attachSchema(Schemas.phoneNumbers);


//permissions
// TODO : stop la redondance
// comment appeler Roles en dehors du fichier collection? problème de scope
ContenusEcran.allow({
  insert: function (){

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
ambiances.allow({
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
loteries.allow({
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