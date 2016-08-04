var componentContentGroupDefault = function(user) {

    spinnerShow();

    ajax('components/contentGroupDefault', function (html) {

        firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {

            content(html);
            spinnerHide();

            // load groups of current admin
            for (var groupUID in snapshot.val().administrator) {

                firebase.database().ref('/groups/' + groupUID).on('value', function (snapshot) {

                    var groupUID = snapshot.key;
                    var group = snapshot.val();

                    firebase.database().ref('/universities/' + group.university).on('value', function (snapshot) {

                        var university = snapshot.val();

                        var blockquote = $('<blockquote>');
                        blockquote.append('<h3>' + group.name + '</h3>');
                        blockquote.append('<p>' + university.name + '</p>');
                        blockquote.append('<p>' +
                            '<button type="button" class="btn btn-primary buttonGroupDetail" data-group="' + groupUID + '">' +
                            'Group Detail' +
                            '</button>' +
                            '</p>');

                        $('#containerGroupsAdmin').append(blockquote);

                        // go to GROUP detail
                        $('.buttonGroupDetail').click(function () {
                            componentContentGroupDetail($(this).data('group'));
                        });
                    });
                });
            }

            // load groups of current user
            for (var groupUID in snapshot.val().groups) {

                firebase.database().ref('/groups/' + groupUID).on('value', function (snapshot) {

                    var groupUID = snapshot.key;
                    var group = snapshot.val();

                    firebase.database().ref('/universities/' + group.university).on('value', function (snapshot) {

                        var university = snapshot.val();

                        var blockquote = $('<blockquote>');
                        blockquote.append('<h3>' + group.name + '</h3>');
                        blockquote.append('<p>' + university.name + '</p>');

                        $('#containerGroupsUser').append(blockquote);
                    });

                });
            }

        });
    });
};



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

            var users = { };
            var numberOfUsers = Object.keys(group.invitations).length + Object.keys(group.users).length;

            var printTable = function () {

                if (Object.keys(users).length < numberOfUsers) {
                    return;
                }

                $('#containerUsers').html('');

                var number = 1;

                for (var index in users) {

                    var user = users[index];

                    var row = $('<tr>');

                    if (user.created != "---") {
                        var createdDate = new Date(user.created);
                        user.created = createdDate.toUTCString();
                    }

                    if (user.accepted != "---") {
                        var acceptedDate = new Date(user.accepted);
                        user.accepted = acceptedDate.toUTCString();
                    }

                    row.append('<th>' + number + '</th>');
                    row.append('<td>' + user.email + '</td>');
                    row.append('<td>' + user.created + '</td>');
                    row.append('<td>' + user.accepted + '</td>');
                    row.append('<td>' +
                        '<button type="button" class="btn btn-default btn-xs buttonUserDelete" data-email="' + user.email + '" data-entity="' + user.entity + '" data-entityid="' + user.id + '" aria-label="Left Align">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                        '</button>' +
                        '</td>');

                    $('#containerUsers').append(row);

                    number++;
                }

                // delete USER click
                $('.buttonUserDelete').click(function () {

                    var email = $(this).data('email');

                    if (confirm('Really delete ' + email + '?')) {

                        firebase.database().ref('/invitations/' + md5(email) + '/groups/'  + groupUID).on('child_removed', function (snapshot) {
                            message("Invitation", "Invitation was canceled!", "alert-success");
                        });
                    }
                    return false;
                });
            };

            for (var userUID in group.users) {

                // foreach userUID load current user
                firebase.database().ref('/users/' + userUID).once('value').then(function (snapshot) {

                    var user = snapshot.val();
                    users[snapshot.key] = { entity: 'user', id: user.uid, email: user.email, created: '---', accepted: group.users[userUID] };
                    printTable();
                });
            };

            for (var invitationUID in group.invitations) {

                // foreach invitationUID load current invitation
                firebase.database().ref('/invitations/' + invitationUID).once('value').then(function (snapshot) {

                    var invitation = snapshot.val();
                    users[snapshot.key] = { entity: 'invitation', id: invitationUID, email: invitation.email, created: invitation.created, accepted: '---' };
                    printTable();
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

                message("Great!", "You created group called " + groupName + "!", 'alert-success');
                modalHide();
                componentContentGroupDefault(user);
            });
        });
    });

    return false;
};
