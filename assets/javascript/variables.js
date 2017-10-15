//stores...

var randomNumber;
var pokeName;
var pokeHealth;
var pokeImage;
var pokeAttack;
var pokeType;

//very important for firebase

var referenceId;

//battle variables

var user
var opponent

var userHealth;
var catchHealth;

var userAttack;
var catchAttack;

//battle themes

var pikachu = new Audio("assets/audioClips/pikachu.wav");
var battleTheme = new Audio("assets/audioClips/battleTheme.wav")
var catched = new Audio("assets/audioClips/catch.wav")

//map variables

var map;
var service;
var infowindow;
var gplaces = ['restaurants', 'book_store', 'fire_station', 'gas_station', 'grocery_or_supermarket', 'gym', 'university', 'train_station', 'shopping_mall', 'post_office', 'museum', 'movie_theater', 'library', 'laundry'];
var markers = {};

//isotope

var selector;

//modals

var infoModal = document.getElementById('infoModal');
var loginFailure = document.getElementById('loginFailure');
var loginSuccess = document.getElementById('loginSuccess');
var pokeCollected = document.getElementById('pokeCollected');
var pokeLost = document.getElementById('pokeLost');
var pokeMissed = document.getElementById('pokeMissed');


