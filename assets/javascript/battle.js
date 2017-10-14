function battleMode() {

  $('#battleMode').css("display", "block");
      battleTheme.play();


  $('#attackButton').on("click", function() {
      pikachu.play();
      user.healthPoints = user.healthPoints - opponent.attackPoints;
      opponent.healthPoints = opponent.healthPoints - user.attackPoints;

      $('#catch .hp').text('hp: ' + opponent.healthPoints);
      $('#user .hp').text('hp: ' + user.healthPoints);

      if (user.healthPoints <= 0) {
        database.ref()
          .child("Users")
          .child(userId.uid)
          .child(selectedPokeID)
          .remove()
        user = false
        removePokeFromPouch(selectedPokeID)
        showPouch()
      };

      if (opponent.healthPoints <= 0) {
        closeBattle()
      }

  });

  $('#catchButton').on("click", function() {
    if (opponent.healthPoints < 10 && opponent.healthPoints > 0) {
      catched.play();
      database.ref().child("Users").child(userId.uid).push({ 
        opponent
      });
    };
  });

  $('#catch').empty();
  var $opponent = renderPoke(opponent, ['attack', 'hp', 'image','name','type'])
  $("#catch").append($opponent)

  if (!user) {
    showPouch()
  } else {
    $('#user').empty()
    var $user = renderPoke(user, ['attack', 'hp', 'image','name','type'])
    $('#user').append($user)
  }
}


$('#pokemonCollection').on("click", ".pokemon", function selectUserPokemon() {
  $('#user').empty();
  $('#pouch').css("display", "none");

//loads the pokemon from the pokemonCollection into the user side of battlemode
  selectedPokeID = $(this).attr('data-id')
  var ref = database.ref().child("Users")
    .child(userId.uid)
    .child(selectedPokeID)
    .once('value')
    .then(function (snapshot) {
      user = getPokeValuesFromDB(snapshot)
      var $user = renderPoke(user, ['attack', 'hp', 'image','name','type'])
      $('#user').append($user)
    })
})

function closeBattle() {
  $('#battleMode').css('display', 'none');
}