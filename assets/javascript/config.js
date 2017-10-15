//Firebase API

var config = {
    apiKey: "AIzaSyDH1QU3JbnLa7kJBeaDy6iBZWyCANneEF8",
    authDomain: "pokemon-g-6760b.firebaseapp.com",
    databaseURL: "https://pokemon-g-6760b.firebaseio.com",
    projectId: "pokemon-g-6760b",
    storageBucket: "pokemon-g-6760b.appspot.com",
    messagingSenderId: "712269966690"
  };

firebase.initializeApp(config);

var database = firebase.database();
var userId;

//ajax

function fetchAjax(num) {
  num = num || Math.floor(Math.random() * 150) + 1;
  return $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon/" + num + '/',
      dataType: 'json',
      method: 'GET'
  });
}

//isotope

var $pokemoncollection = $('#pokemonCollection');

$pokemoncollection.isotope({
  itemselector: '.pokemon',
  layoutMode: 'fitRows',
  getSortData: {
    attack: '[data-attack]',
    name: '[data-name]',
    hp: '[data-hp]',
    type: '[data-type]'
  },
  sortBy: 'hp'
});

//isotope controls

$('#pouchControls .sortby.attack').on('click', function () {
  selector = 'attack';
  loadPokemon();
  $pokemoncollection.isotope({sortBy : 'attack', sortAscending: false})
})
$('#pouchControls .sortby.name').on('click', function () {
  selector = 'name';
  loadPokemon();
  $pokemoncollection.isotope({sortBy : 'name', sortAscending: true})
})
$('#pouchControls .sortby.hp').on('click', function () {
  selector = 'health';
  loadPokemon();
  $pokemoncollection.isotope({sortBy : 'hp', sortAscending: false})
})
$('#pouchControls .sortby.type').on('click', function () {
  selector = 'type';
  loadPokemon();
  $pokemoncollection.isotope({sortBy : 'type', sortAscending: true})
})



//on click open and close pouch

$('#pouchButton').on("click", function() {
  loadPokemon();
  $('#pouch').css("display", "block");
});

$('#closePouch').on("click", function() {
  $('#pouch').css("display", "none");
});

$('#closeBattle').on("click", function() {
  $('#battleMode').css("display", "none");
});

//on click open and close help modal

var infoModal = document.getElementById('infoModal');
var infoButton = document.getElementById('infoButton');
var infoClose = document.getElementById('close');

$(infoButton).on('click', function(){
  infoModal.style.display = 'block';
});

$(infoClose).on('click', function(){
  infoModal.style.display = 'none';
});

window.onclick = function(event){
  if (event.target == infoModal){
    infoModal.style.display = 'none';
  }
};



