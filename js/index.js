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

    $('#btnCreateGroup').click(function () {

        componentCreateGroupModal();

    });

    //initDB();
});


var initDB = function() {

    var categories = [
        { color: 0, title: 'Food Shopping' },
        { color: 30, title: 'MTR' },
        { color: 60, title: 'Sightseeing' },
        { color: 90, title: 'Nightlife' },
        { color: 120, title: 'Hotel' },
        { color: 150, title: 'Restaurant' },
        { color: 180, title: 'Clothes' },
        { color: 210, title: 'Souvenires' }
    ];

    for (var i in categories) {

        firebase.database().ref('categories').push(
            categories[i]
        );
    }

}
