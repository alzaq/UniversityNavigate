$(document).ready(function () {

    // firebase init
    firebase.initializeApp({
        apiKey: "AIzaSyDv79D1E0-zUcocN0MSrCqDk3eCIrgqVTE",
        authDomain: "cityu-navigator.firebaseapp.com",
        databaseURL: "https://cityu-navigator.firebaseio.com",
        storageBucket: "cityu-navigator.appspot.com",
    });

    // am I logged or not?
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // if I'm logged, show logged status, load data from Firebase and show Group of detail
            spinnerShow();
            showUserLoggedComponent(user);
            componentContentGroupDetail(user);
        } else {
            // if not, show unlogged status, and show default page
            showUserUnloggedComponent();
            componentContentDefault();
        }
    });

    // btn sign up
    $('#btnSignIn').click(function () {
        componentSignInModal();
        return false;
    });


    $('#btnSignOut').click(function () {
        firebase.auth().signOut().then(function () {
            message('Success', 'See you later man!', 'alert-success');
        }, messageError);
    });

});
