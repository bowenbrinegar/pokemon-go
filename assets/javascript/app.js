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
        loadPokemon();
        fetchAjax().done(addPokeToVariables);
        $('#pouch').css("display", "block");
    });    
};

//ajax and variables
//bunch of global variables hidden deep in code
//#style

var randomNumber;
var pokeName;
var pokeHealth;
var pokeImage;

var referenceId;

var userHealth;
var catchHealth;

function fetchAjax() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  return $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon/" + randomNumber + '/',
      dataType: 'json',
      method: 'GET'
  });
}

function addPokeToVariables(response) {
  pokeName = response.name;
  pokeHealth = response.base_experience;
  catchHealth = response.base_experience;
  pokeImage = response.sprites.front_shiny;

  // database.ref().push({ 
  //           name: pokeName,
  //           health: pokeHealth,
  //           image: pokeImage
  //         });
}


$('#pokemonCollection').on("click", "button", function() {
  $('#user').empty();
  $('#pouch').css("display", "none");

//loads the pokemon from the pokemonCollection into the user side of battlemode
  referenceId = $(this).attr("data-id");
  var ref = firebase.database().ref(referenceId);
  ref.on("value", function(snapshot) {

    userHealth = snapshot.val().health

    var nameEntry = $('<h3>').text(snapshot.val().name)
    var healthEntry = $('<h2>').text(userHealth)
    var imageEntry = $("<img class='pokeBattle'>").attr("src", snapshot.val().image);

    $('#user').append(imageEntry, healthEntry, nameEntry)

  }, function (error) {
     console.log("Error: " + error.code);
  });

//loads the pokemon from the random Ajax call into the catch side of battlemode
  $('#catch').empty();
  var nameEntry = $('<h3>').text(pokeName)
  var healthEntry = $('<h2>').text(catchHealth)
  var imageEntry = $("<img class='pokeBattle'>").attr("src", pokeImage)
  $("#catch").append(imageEntry, healthEntry, nameEntry)

  battleMode();
})


function battleMode() {
  $('#battleMode').css("display", "block");

  $('#attackButton').on("click", function() {
      userHealth = userHealth - 10;
      catchHealth = catchHealth - 10;

      $('#catch h2').text(catchHealth);
      $('#user h2').text(userHealth);

      if (userHealth <= 0) {
        var ref = firebase.database().ref(referenceId);
        ref.remove()
      };

      $('#catchButton').on("click", function() {
        if (catchHealth < 10 && catchHealth > 0) {
          database.ref().push({ 
            name: pokeName,
            health: pokeHealth,
            image: pokeImage
          });
        };
      });   
  });

  

// closes battle mode, potentially shows stats of pokemon collected
  // if (gameover) {
  // $('#battleMode').css("display", "none");
  // }

}



var removeMarker = function(marker, markerId) {
    marker.setMap(null);
    delete markers[markerId];
};

//firebase
function loadPokemon() {
  $('#pokemonCollection').empty()

    database.ref().on("child_added", function(childSnapshot){
       var image = $("<img class='poke'>").attr("src", childSnapshot.val().image);
       var button = $("<button id='pokeselectorbutton' data-id='" + childSnapshot.key + "'>").append(image)
       
       $("#pokemonCollection").prepend(button)
    });
}


//on click open and close pouch

// $('#pouchbutton').on("click", function() {
  // loadPokemon();
//   $('#pouch').css("display", "block");
// });

// $('#closePouch').on("click", function() {
//   $('#pouch').css("display", "none");
// });

$('#closeBattle').on("click", function() {
  $('#battleMode').css("display", "none");
});


