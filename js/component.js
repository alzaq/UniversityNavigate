/**
 * Component ContentGroupDetail
 * @param user
 */
var componentContentGroupDetail = function(user) {

    ajax('components/contentGroupDetail', function (html) {

        firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {

            // load groups of current admin
            var administrator = snapshot.val().administrator;

            for (var groupUID in administrator) {

                firebase.database().ref('/groups/' + groupUID).on('value', function (snapshot) {

                    spinnerHide();
                    content(html);

                    var group = snapshot.val();

                    $('#groupDetailName').html(group.name);

                    var number = 1;
                    var loadUserAsRowInTable = function (entity, id, email, created, accepted) {
                        var row = $('<tr>');

                        if (created != "---") {
                            var createdDate = new Date(created);
                            created = createdDate.toUTCString();
                        }

                        if (accepted != "---") {
                            var acceptedDate = new Date(accepted);
                            accepted = acceptedDate.toUTCString();
                        }

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

                                firebase.database().ref('/invitations/' + md5(email) + '/groups/'  + groupUID).on('child_removed', function (snapshot) {
                                    message("Invitation", "Invitation was canceled!", "alert-success");
                                });
                            }
                            return false;
                        });

                        number++;
                    };

                    for (var userUID in group.users) {

                        // foreach userUID load current user
                        firebase.database().ref('/users/' + userUID).once('value').then(function (snapshot) {

                            var user = snapshot.val();
                            loadUserAsRowInTable('user', userUID, user.email, '---', group.users[userUID]);
                        });
                    };

                    for (var invitationUID in group.invitations) {

                        // foreach invitationUID load current invitation
                        firebase.database().ref('/invitations/' + invitationUID).once('value').then(function (snapshot) {

                            var invitation = snapshot.val();
                            loadUserAsRowInTable('invitation', invitationUID, invitation.email, invitation.created, '---');
                        });
                    };

                    // add user click
                    $('#btnAddUser').click(function () {
                        ajax('components/addUserModalDialog', function (html) {
                            modal(html);

                            $('#buttonUserAdd').click(function () {

                                var email = $('#inputEmail').val();
                                var emailMD5 = md5(email);
                                var created = new Date().getTime();

                                var updates = {};
                                updates['/groups/' + groupUID + '/invitations/' + emailMD5] = created;
                                updates['/invitations/' + emailMD5 + '/email'] = email;
                                updates['/invitations/' + emailMD5 + '/created'] = created;
                                updates['/invitations/' + emailMD5 + '/groups/' + groupUID] = created;
                                firebase.database().ref().update(updates);

                                // TODO send email



                                modalHide();
                                message("HEY", "Successfuly added", "alert-success");

                            });
                        });
                    });
                });
                return;
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

                    // create user
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then(function (user) {

                            modalHide();
                            //spinnerShow();

                            // create group
                            var created = new Date().getTime();

                            var updates = {};
                            updates['/users/' + user.uid] = {
                                email: user.email,
                                created: created
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

var componentCreateGroupModal = function () {


    ajax('components/addGroupModalDialog', function (html) {
        modal(html);

        firebase.auth().onAuthStateChanged(function(user) {

            $('#buttonGroupCreate').click(function () {

                var groupName = $('#inputGroupName').val();
                var universityUID = $('#inputUniversity').val();

                var created = new Date().getTime();

                var groupUID = firebase.database().ref().child('groups').push().key;
                var userUID = user.uid;
                var emailMD5 = md5(user.email);

                var updates = {};
                updates['/users/' + user.uid + '/administrator/' + groupUID] = created;

                updates['/groups/' + groupUID] = {
                    university: universityUID,
                    administrator: userUID,
                    created: created,
                    name: groupName
                };
                //updates['/groups/' + groupUID + '/invitations/' + emailMD5] = created;

                updates['/invitations/' + emailMD5 + '/groups/' + groupUID] = created;
                updates['/invitations/' + emailMD5 + '/email'] = user.email;
                updates['/invitations/' + emailMD5 + '/created'] = created;
                firebase.database().ref().update(updates);

            });

        });

    });


}