

Template.data.onCreated(function() {

  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('allContenusEcran');
  });

  console.log("created");
  console.log(this);
  console.log("created2");
  console.log(demoData);



});

Template.data.onRendered(function () {

  $(document.body).addClass('data');

  $( window ).resize(function() {
    ratioResize($('#demo-ecran'), 16, 9);
  });
  console.log('salut data!');
  ratioResize($('#demo-ecran'), 16, 9);

  function ratioResize(element, ratioWidth, ratioHeight){
    if(!element || !ratioWidth || !ratioHeight) return false;
    element.css( 'height', parseInt(element.css('width')) * (ratioHeight/ratioWidth) );
  }

  // console.log('welcome to data!', Parser, this, Template.instance(), ContenusEcran.find().fetch());
  console.log('welcome to data!', this, Template.instance(), ContenusEcran.find().fetch());

  var templateInstance = Template.instance();

  //demoNext event
  $(document.body).on('keyup', function(e) {
      // KEYCODE 32 IS SPACEBAR
      // KEYCIODE 78 IS "n"
    // this = 
    console.log('keyup', demoData.length, e, Template.instance(), interupt);
    if(e.keyCode =='78' && demoCompteur <= demoData.length){
      e.stopPropagation();
      e.preventDefault();
      demoCompteur +=1
      demoNext();
      return false;
    }
  });

  $('#displayDemoCompteur').on('keyup', function(e){
    if(e.keyCode =='13' && $('#displayDemoCompteur').val() <= demoData.length){
      demoCompteur = $('#displayDemoCompteur').val()-1;
      demoNext();
    }
  });

});

demoCompteur = 0;
var interupt = false
var indeximg = 0
var alternance = false

demoData = [];



  console.log(this);


  demoNext = function (){
    console.log("demoNext", demoCompteur, this, this.demoNext, demoData, alternance)
    // var currentSub = demoData[demoCompteur]
    // document.getElementById("srt").innerHTML = currentSub

    // balise = demoData[demoCompteur]["balise"]

    // if(_balise != balise){

    //   // quand tu tombes sur une balise crac passe des arguments
    //   // à action qui décide quoi faire du coup.
    //   this.action(demoData[demoCompteur]["balise"], demoData[demoCompteur]["text"])

    //   balise = _balise
    //   demoCompteur+=1
    //   this.demoNext()
    // }

    //TODO
    //attention dans le cas actuel il est impossible d'avoir la div de texte vide. il faudrait avoir une balise
    //action spécifique pour vider la div
    //solution envisagée :
    //au moment de parser data, il rajoute une balise #clear une ligne sur deux par exemple

    var currentData = demoData[demoCompteur]
    var type = currentData["type"]
    var params = currentData["text"]

    while((demoData[demoCompteur]["type"]!="text")||((demoData[demoCompteur]["type"]=="text")&&(demoData[demoCompteur]["text"]==""))){
        // tant que demoData[demoCompteur] est une balise, ben continue à executer les instructions s'il te plaît
        action(type, params)
        if((demoData[demoCompteur]["type"]!="text")||(demoData[demoCompteur]["text"]=="")){
          // euh alors ça je sais pas pourquoi ça marche mais ça permet d'éviter des situations où, arrivé à un bookmark
          // il sautait deux lignes au lieu d'une
          demoCompteur+=1;
          console.log("this.demoNext?", demoNext);
          demoNext();
        }
      }
      if((type=="text")&&(params!="")){
        document.getElementById("srt").innerHTML = params
        // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
      }
      $('#displayDemoCompteur').val(demoCompteur);
  };

Template.data.helpers({

  listContenusEcran:function(){
    return ContenusEcran.find();
  },

  dataArray: function (obj) {
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

  displayDemoCompteur:function(){
    console.log('demoCompteur', demoCompteur)
    return demoCompteur;
  }

});

Template.data.events({
    'click #text-to-json': function(event) {
      console.log('text-to-json!');
      event.preventDefault();
      $('#json-result').val( rawTextToJson($('#text-raw').val()) );
      console.log(Template.instance());
      zoupageJSON($('#json-result').val(), demoData);
    },
    'click #save-json': function(event) {
      console.log('save-json!');
      event.preventDefault();
      var contenuNom = $('#json-name').val();
      var contenuData = $('#json-result').val();
      console.log('nom', contenuNom, typeof contenuNom, 'data result', contenuData, typeof contenuData);
      Meteor.call('newContenuEcran', {name: contenuNom, data: contenuData});
    }
});