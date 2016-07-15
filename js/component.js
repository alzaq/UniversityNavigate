/**
 * Component ContentGroupDetail
 * @param user
 */
var componentContentGroupDetail = function(user) {

    ajax('components/contentGroupDetail', function (html) {

        firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {

            // load groups of current admin
            var groups = snapshot.val().administrator;

            // TODO only first group for this time
            if (groups.length > 0) {
                var groupUID = groups[0];
                firebase.database().ref('/groups/' + groupUID).on('value', function (snapshot) {

                    spinnerHide();
                    content(html);

                    var group = snapshot.val();

                    $('#groupDetailName').html(group.name);

                    var number = 1;
                    var loadUserAsRowInTable = function(entity, id, email, created) {
                        var row = $('<tr>');

                        row.append('<th>' + number + '</th>');
                        row.append('<td>' + email + '</td>');
                        row.append('<td>' + created + '</td>');
                        row.append('<td>' + accepted + '</td>');
                        row.append('<td>' +
                            '<button type="button" class="btn btn-default btn-xs buttonUserDelete" data-entity="' + entity + '" data-entityid="' + id + '" aria-label="Left Align">' +
                            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                            '</button>' +
                            '</td>');

                        $('#containerUsers').append(row);

                        $('.buttonUserDelete').click(function () {

                            if (confirm('Really delete ' + user.email + '?')) {
                                alert("Deleted");
                            }
                            return false;
                        });

                        number++;
                    };

                    $.each(group.users, function (key, userUID) {

                        // foreach userUID load current user
                        firebase.database().ref('/users/' + userUID).once('value').then(function (snapshot) {

                            var user = snapshot.val();
                            loadUserAsRowInTable('user', key, user.email, user.created);
                        });
                    });

                    $.each(group.invitations, function (key, invitationUID) {

                        // foreach invitationUID load current invitation
                        firebase.database().ref('/invitations/' + invitationUID).once('value').then(function (snapshot) {

                            var invitation = snapshot.val();
                            loadUserAsRowInTable('invitation', key, invitation.email, "");
                        });
                    });


                    // add user click
                    $('#btnAddUser').click(function () {
                        ajax('components/addUserModalDialog', function (html) {
                            modal(html);

                            $('#buttonUserAdd').click(function () {

                                var email = $('#inputEmail').val();
                                var emailMD5 = md5(email);
                                var created = new Date().getTime();

                                firebase.database().ref('invitations/' + emailMD5).set({
                                    email: email,
                                    created: created,
                                    groups: {
                                        0: groupUID
                                    }
                                });

                                firebase.database().ref('groups/' + groupUID + "/invitations").push({
                                    email: emailMD5
                                });


                            });
                        });
                    });
                });
            }
        });
    });
};


/**
 * Component ContentDefault
 */
var componentContentDefault = function () {

    ajax('components/contentDefault', function (html) {

        content(html);

        // btn sign up
        $('#btnSignUp').click(function () {

            ajax('components/signUpModalDialog', function (html) {

                modal(html);

                $('#buttonSignUp').click(function () {

                    var email = $('#inputEmail').val();
                    var password = $('#inputPassword1').val();
                    var groupName = $('#inputGroupName').val();

                    // TODO
                    var universityUID = '-KMbA50SGF3cnz-qOtJa';

                    // create user
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then(function (user) {

                            modalHide();
                            spinnerShow();

                            // create group
                            var groupUID = firebase.database().ref().child('groups').push().key;
                            var userUID = user.uid;
                            var emailMD5 = md5(user.email);
                            var created = new Date().getTime();

                            var updates = {};
                            updates['/groups/' + groupUID] = {
                                university: universityUID,
                                administrator: userUID,
                                created: created,
                                name: groupName
                            };
                            updates['/invitations/' + emailMD5] = {
                                email: email
                            };
                            updates['/users/' + user.uid] = {
                                email: user.email,
                                created: created
                            };
                            firebase.database().ref().update(updates);

                            var updates = {};
                            updates['/groups/' + groupUID + '/invitations/' + userUID] = created;
                            updates['/invitations/' + emailMD5 + '/groups/' + groupUID] = created;
                            updates['/users/' + user.uid + '/administrator/' + groupUID] = created; // TODO
                            firebase.database().ref().update(updates);

                            message("Welcome!", "Welcome " + user.email + "!", 'alert-success');
                        })
                        .catch(messageError);
                    return false;
                });
            });
            return false;
        });
    });
};


/**
 * Component SignInModal
 */
var componentSignInModal = function () {

    ajax('components/signInModalDialog', function (html) {

        modal(html);

        $('#buttonSignIn').click(function () {

            var email = $('#inputEmail').val();
            var password = $('#inputPassword').val();

            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (user) {
                modalHide();
                message("Welcome!", "Welcome " + user.email + "!", 'alert-success');
            })
            .catch(messageError);
        });
    });
};