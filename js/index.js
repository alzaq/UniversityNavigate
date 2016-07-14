$(document).ready(function() {

  // firebase init
  firebase.initializeApp({
    apiKey: "AIzaSyDv79D1E0-zUcocN0MSrCqDk3eCIrgqVTE",
    authDomain: "cityu-navigator.firebaseapp.com",
    databaseURL: "https://cityu-navigator.firebaseio.com",
    storageBucket: "cityu-navigator.appspot.com",
  });

  // am I logged or not?
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {

      $('#containerUnlogged').hide();
      $('#containerLogged').show();

      $('#userStatusEmail').html(user.email);

      spinnerShow();

      ajax('components/contentGroupDetail', function(html) {

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {

          var groups = snapshot.val().groups;

          firebase.database().ref('/groups/' + groups[0]).on('value', function(snapshot) {

            spinnerHide();
            content(html);

            var group = snapshot.val();

            $('#groupDetailName').html(group.name);

            $.each(group.users, function(key, user) {
              $('#containerUsers').append('<tr><th>' + key + '</th><td>' + user + '</td><td></td><td></td><td><button type="button" class="btn btn-default btn-xs" aria-label="Left Align"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td></tr>');
            });

            $('#btnAddUser').click(function() {
              ajax('components/addUserModalDialog', function(html) {
                modal(html);
              })
            });



          });
        });


      });


    } else {

      $('#containerUnlogged').show();
      $('#containerLogged').hide();

      ajax('components/contentDefault', function(html) {

        content(html);

        // btn sign up
        $('#btnSignUp').click(function() {

          ajax('components/signUpModalDialog', function(html) {

            modal(html);

            $('#buttonSignUp').click(function() {

              var email = $('#inputEmail').val();
              var password = $('#inputPassword1').val();
              var groupName = $('#inputGroupName').val();

              // TODO
              var universityUID = '-KMbA50SGF3cnz-qOtJa';

              // create user
              firebase.auth().createUserWithEmailAndPassword(email, password)
                  .then(function(user) {

                    modalHide();
                    spinnerShow();

                    // create group
                    var groupUID = firebase.database().ref().child('groups').push().key;

                    var updates = {};
                    updates['/groups/' + groupUID] = {
                      university : universityUID,
                      administrator : user.uid,
                      name : groupName,
                      users : {
                        0 : user.uid
                      }
                    };
                    updates['/users/' + user.uid] = {
                      email : user.email,
                      groups : {
                        0 : groupUID
                      }
                    };
                    firebase.database().ref().update(updates);

                    message("Welcome!", "Welcome " + user.email + "!", 'alert-success');

                  })
                  .catch(messageError);
              return false;
            });
          });
          return false;
        });



      })
    }
  });



  // btn sign up
  $('#btnSignIn').click(function() {

    ajax('components/signInModalDialog', function (html) {

      modal(html);

      $('#buttonSignIn').click(function() {

        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user) {
          modalHide();
          message("Welcome!", "Welcome " + user.email + "!", 'alert-success');
        })
        .catch(messageError);

      });

    });
    return false;
  });

  $('#btnSignOut').click(function() {
    firebase.auth().signOut().then(function() {
      message('Success', 'See you later man!', 'alert-success');
    }, messageError);
  });

});
