function battleMode() {

  $('#battleMode').css("display", "block");
      battleTheme.play();


  $('#attackButton').on("click", function() {
      pikachu.play();

      userHealth = userHealth - 10;
      catchHealth = catchHealth - 10;

      $('#catch h2').text(catchHealth);
      $('#user h2').text(userHealth);

      if (userHealth <= 0) {
        var ref = database.ref().child("Users").child(userId.uid).child(referenceId);
        ref.remove()
      };

  });

  $('#catchButton').on("click", function() {
    if (catchHealth < 10 && catchHealth > 0) {
      catched.play();
      database.ref().child("Users").child(userId.uid).push({ 
        name: pokeName,
        health: pokeHealth,
        image: pokeImage
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
  referenceId = $(this).attr("data-id");
  var ref = database.ref().child("Users")
    .child(userId.uid)
    .child(referenceId)
    .once('value')
    .then(function (snapshot) {
      user = getPokeValuesFromDB(snapshot)
      var $user = renderPoke(user, ['attack', 'hp', 'image','name','type'])
      $('#user').append($user)
    })
})