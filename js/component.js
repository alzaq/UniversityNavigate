var componentContentGroupDefault = function(user) {

    spinnerShow();

    ajax('components/contentGroupDefault', function (html) {

        firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {

            content(html);
            spinnerHide();

            // load groups of current admin
            for (var groupUID in snapshot.val().administrator) {

                firebase.database().ref('/groups/' + groupUID).on('value', function (snapshot) {

                    var group = snapshot.val();

                    var blockquote = $('<blockquote>');
                    blockquote.append('<h3>' + group.name + '</h3>');
                    blockquote.append('<p>' + group.university + '</p>');
                    blockquote.append('<p>' +
                        '<button type="button" class="btn btn-primary buttonGroupDetail" data-group="' + groupUID + '">' +
                        'Group Detail' +
                        '</button>' +
                        '</p>');

                    $('#containerGroupsAdmin').append(blockquote);

                    $('.buttonGroupDetail').click(function () {
                        componentContentGroupDetail(groupUID);
                    });
                });
            }

            // load groups of current user
            for (var groupUID in snapshot.val().groups) {

                firebase.database().ref('/groups/' + groupUID).on('value', function (snapshot) {

                    var group = snapshot.val();

                    var blockquote = $('<blockquote>');
                    blockquote.append('<h3>' + group.name + '</h3>');
                    blockquote.append('<p>' + group.university + '</p>');

                    $('#containerGroupsUser').append(blockquote);
                });
            }

        });

    });

}



/**
 * Component ContentGroupDetail
 * @param user
 */
var componentContentGroupDetail = function(groupUID) {

    ajax('components/contentGroupDetail', function (html) {

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
                    '<button type="button" class="btn btn-default btn-xs buttonUserDelete" data-email="' + email + '" data-entity="' + entity + '" data-entityid="' + id + '" aria-label="Left Align">' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                    '</button>' +
                    '</td>');

                $('#containerUsers').append(row);

                $('.buttonUserDelete').click(function () {

                    if (confirm('Really delete ' + $(this).data('email') + '?')) {

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
    });
    return false;
};


/**
 * Component ContentDefault
 */
var componentContentDefault = function () {

    ajax('components/contentDefault', function (html) {

        content(html);

        // btn sign up
        $('#btnSignUp').click(componentSignUpModal);
    });
};


/**
 * Component SignInModal
 */
var componentSignInModal = function () {

    ajax('components/signInModalDialog', function (html) {

        modal(html);

        // btn sign in
        $('#buttonSignIn').click(function () {

            var email = $('#inputEmail').val();
            var password = $('#inputPassword').val();

            if (email == "" || password == "") {
                message("Error", "Please fill email a password correctly", "alert-danger");
                return false;
            }

            // firebase login
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (user) {
                message("Welcome!", "Welcome " + user.email + "!", 'alert-success');
                modalHide();
            })
            .catch(messageError);
        });
    });

    return false;
};

/**
 * Component SignUpModal
 */
var componentSignUpModal = function () {

    ajax('components/signUpModalDialog', function (html) {

        modal(html);

        // btn sign up
        $('#buttonSignUp').click(function () {

            var email = $('#inputEmail').val();
            var password1 = $('#inputPassword1').val();
            var password2 = $('#inputPassword2').val();

            if (email == "" || password1 != password2) {
                message("Error", "Please fill email a password correctly", "alert-danger");
                return false;
            }

            // firebase sign up
            firebase.auth().createUserWithEmailAndPassword(email, password1)
            .then(function (user) {

                // create USER
                var email = user.email;
                var created = new Date().getTime();

                var updates = {};
                updates['/users/' + user.uid] = {
                    email: email,
                    created: created
                };
                firebase.database().ref().update(updates);

                message("Welcome!", "Welcome " + email + "!", 'alert-success');
                modalHide();
            })
            .catch(messageError);
            return false;
        });
    });

    return false;
};

/**
 * Component CreateGroupModal
 */
var componentCreateGroupModal = function () {

    ajax('components/addGroupModalDialog', function (html) {

        modal(html);

        firebase.auth().onAuthStateChanged(function(user) {

            $('#buttonGroupCreate').click(function () {

                // create GROUP
                var groupName = $('#inputGroupName').val();
                var universityUID = $('#inputUniversity').val();
                var userUID = user.uid;
                var created = new Date().getTime();

                var groupUID = firebase.database().ref().child('groups').push().key;
                var emailMD5 = md5(user.email);

                var updates = {};
                updates['/groups/' + groupUID] = {
                    university: universityUID,
                    administrator: userUID,
                    created: created,
                    name: groupName
                };
                firebase.database().ref().update(updates);

                var updates = {};
                updates['/groups/' + groupUID + '/invitations/' + emailMD5] = created;

                updates['/users/' + user.uid + '/administrator/' + groupUID] = created

                updates['/invitations/' + emailMD5 + '/groups/' + groupUID] = created;
                updates['/invitations/' + emailMD5 + '/email'] = user.email;
                updates['/invitations/' + emailMD5 + '/created'] = created;
                firebase.database().ref().update(updates);
            });
        });
    });

    return false;
};