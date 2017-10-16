$('#sumbit').on("click", function() {
   var select = $('#sel1').val();
   var email = $('#email').val();
   var password = $('#password').val();
  
   

   if (select == 2) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success){
        $('#userPortal').hide();
        userId = firebase.auth().currentUser;
        userRef = database.ref().child("Users").child(userId.uid);
        loginSuccess.style.display = 'block';
        initialPokemon()
      }).catch(function(error) {
        loginFailure.style.display = 'block';
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("User Does Not Exist: " + errorMessage);
      });
   }
   if (select == 1) {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(success){
        $('#userPortal').hide();
        userId = firebase.auth().currentUser;
        userRef = database.ref().child("Users").child(userId.uid);
        initPouchHandler()
        loginSuccess.style.display = 'block';

        userRef.on('value', function(snap) { markers = snap.val().markers; });
        userRef.on('value', function(snap) { berries = snap.val().berries; });

      }).catch(function(error) {
        loginFailure.style.display = 'block';
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Invalid Email: " + errorMessage);
      });
    };
    
});

function initialPokemon() {
    //global variable for user database reference
    fetchAjax().done(function (response){
      userRef.push(getPokeValues(response))
    })
}

// initializer for long-standing DB .on functions
// to stop some of the compounding recursion
function initPouchHandler() {
  userRef.on("child_added", function(childSnapshot){
    var poke = getPokeValuesFromDB(childSnapshot)
    
    var dataObj;

    var $div = renderPokeInPouch(poke)
    
    decoratePouchHover($div)

    $pokemoncollection
      .prepend($div)
      .isotope('prepended', $div)
  });

  //userRef.on('child_removed') ---TODO
}