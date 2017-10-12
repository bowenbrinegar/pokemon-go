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


// user input
$('#sumbit').on("click", function() {
   var select = $('#sel1').val();
   var email = $('#email').val();
   var password = $('#password').val();
  
   

   if (select == 2) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success){
        alert("New User Created");
        userId = firebase.auth().currentUser;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
   }
   if (select == 1) {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(success){
        alert("Your Logged In");
        userId = firebase.auth().currentUser;
        loadPokemon();
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    };

    $('#userPortal').hide();
});
   





//Map, Markers, Marker Remove, Marker Action

var map;
var service;
var infowindow;
var gplaces = ['restaurants', 'book_store', 'fire_station', 'gas_station', 'grocery_or_supermarket', 'gym', 'university', 'train_station', 'shopping_mall', 'post_office', 'museum', 'movie_theater', 'library', 'laundry'];
var markers = {};

function initMap() {
  var location = {lat: 40.713425, lng: -74.005524};

  map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 17
      });

  service = new google.maps.places.PlacesService(map);

  infowindow = new google.maps.InfoWindow();
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.panTo(location)
    }); 
  }


  map.addListener('tilesloaded', function (event) {
    service.nearbySearch({
        location: map.getCenter(),
        radius: 20,
        type: gplaces
      }, createPokeMarkers);
  });
}    


function createPokeMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]); 
    }
  }
}

function createMarker(place) {
  var image = new google.maps.MarkerImage("assets/images/pokeball.png", null, null, null, new google.maps.Size(40,40));
  var markerId = place.geometry.location;
  if (!markers['marker_' + markerId]) {
    var marker = new google.maps.Marker({
      position: markerId,
      icon: image,
      map: map,
      id: 'marker_' + markerId,
    });
   markers[marker.get('id')] = marker;
   bindMarkerEvents(marker);
  }
}

//http://jsfiddle.net/fatihacet/CKegk/

var getMarkerUniqueId = function(lat, lng) {
    return lat + ', ' + lng;
}

var bindMarkerEvents = function(marker) {
    // google.maps.event.addListener(marker, 
    marker.addListener("click", function (point) {
        var markerId = "marker_(" + getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()) + ")";
        var marker = markers[markerId];
        removeMarker(marker, markerId); 
        // loadPokemon();
        // fetchAjax().done(addPokeToVariables);
        // $('#pouch').css("display", "block");
        fetchAjax().done(function (resp) {
          opponent = getPokeValues(resp)
          // addPokeToPouch(opponent)
          addPokeToDB(opponent)
          battleMode();
        });
    });    
};

//ajax and variables
//bunch of global variables hidden deep in code
//#style

var user;
var opponent;

var referenceId;

var userHealth;
var catchHealth;

var pikachu = new Audio("assets/audioClips/pikachu.wav");
var battleTheme = new Audio("assets/audioClips/battleTheme.wav")
var catched = new Audio("assets/audioClips/catch.wav")

var $pokemoncollection = $('#pokemonCollection').isotope({
  itemselector: '.pokeselectorbutton',
  layoutMode: 'fitRows',
  getSortData: {
    id: '.id',
    name: '.name',
    hp: '.hp',
    type: '.type'
  },
  sortBy: ['id', 'hp']
})
$('#pouchControls .sortby.number').on('click', function () {
  console.log('clicked me')
  $pokemoncollection.isotope({sortBy : 'id'})
})
$('#pouchControls .sortby.type').on('click', function () {
  $pokemoncollection.isotope({sortBy : 'type'})
})
$('#pouchControls .sortby.hp').on('click', function () {
  $pokemoncollection.isotope({sortBy : 'hp', sortAscending: false})
})

function fetchAjax() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  return $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon/" + randomNumber + '/',
      dataType: 'json',
      method: 'GET'
  });
}

function addPokeToVariables(response) {
  var poke = getPokeValues(response) 
  pokeName = poke.name;
  pokeHealth = poke.hp;
  catchHealth = poke.hp;
  pokeImage = poke.image;
}

function getPokeValues(response) {
  var res = {
    num: response.id,
    image: response.sprites.front_default,
    name: response.name,
    attack: response.stats[4].base_stat,
    hp: response.stats[5].base_stat,
    type: response.types[0].type.name
  }
  return res
} //will decide what data gets saved

function getPokeValuesFromDB(snapshot) {
  var poke = snapshot.val()
  poke.key = snapshot.key
  return poke
}

function addPokeToPouch(pokeObj) {
  var $poke = renderPoke(pokeObj)
  $pokemoncollection.prepend($poke).isotope('prepended', $poke).isotope()
}

function addPokeToDB(pokeObj) {
  var ref = database.ref().child("Users").child(userId.uid);
  ref.push(pokeObj);
}

function renderPoke(pokeObj, keys) {
  var $div = $("<button class='pokeselectorbutton' data-id='" + pokeObj.key + "' data-num='" + pokeObj.num + "'>")
  if (!keys || !keys.length) { keys = Object.getOwnPropertyNames(pokeObj) }
  keys.forEach(k => {
    switch(k) {
      case 'id': {
        $div.append($('<div class="id">').text('id: ' + pokeObj.id))
        break
      }
      case 'name': {
        $div.append($('<div class="name">').text('name: ' + pokeObj.name))
        break
      }
      case 'type': {
        $div.append($('<div class="type">').text('type: ' + pokeObj.type))
        break
      }
      case 'attack': {
        $div.append($('<div class="attack">').text('attack: ' + pokeObj.attack))
        break
      }
      case 'hp': {
        $div.append($('<div class="hp">').text('hp: ' + pokeObj.hp))
        break
      }
      case 'image': {
        $div.append($("<img class='poke'>").attr("src", pokeObj.image))
        break
      }
    }
  })
  console.log($div)
  return $div
} //will output poke image and data in html

var removeMarker = function(marker) {
    marker.setMap(null);
};

//firebase
function loadPokemon() {
  $('#pokemonCollection').empty()

    var ref = database.ref().child("Users").child(userId.uid)

    ref.on("child_added", function(childSnapshot){
      var poke = getPokeValuesFromDB(childSnapshot)
      console.log(poke)
      addPokeToPouch(poke)
      // var image = $("<img class='poke'>").attr("src", poke.image);
      // var name = $("<h4 class='hoverName'>").append(poke.name);
      // var health = $("<h4 class='hoverHealth'>").append(poke.hp);
      // var button = $("<button class='button__description' data-id='" + poke.key + "'>").append(name, health);
      // var div = $("<div class='button__wrap'>").append(image, button);

      // $("#pokemonCollection").prepend(div)
    });
}

//on click open and close pouch
$('#pouchbutton').on("click", function() {
  loadPokemon();
  $('#pouch').css("display", "block");
});

$('#closePouch').on("click", function() {
  $('#pouch').css("display", "none");
});

$('#closeBattle').on("click", function() {
  $('#battleMode').css("display", "none");
});

$('#closeBattle').on("click", function() {
  $('#battleMode').css("display", "none");
});
