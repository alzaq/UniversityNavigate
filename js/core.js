var ajax = function (layout, done) {
    $.ajax({
        method: "GET",
        url: '/' + layout + '.html?' + $.now()
    }).done(done);
};

var modal = function (html) {
    $('#containerModal').html(html);
    $('#myModal').modal('show');
};

var content = function (html) {
    $('#containerContent').html(html);
};

var modalHide = function () {
    $('#myModal').modal('hide')
};

var spinnerShow = function () {
    $('#spinner').show();
    $('#containerContent').hide();
};

var spinnerHide = function () {
    $('#spinner').hide();
    $('#containerContent').show();
};

var message = function (title, text, type) {

    ajax('components/message', function (html) {

        $('#containerMessage').html(html);
        $('#containerMessage').fadeIn('slow');

        $('#message').attr('class', 'alert ' + type);
        $('#messageTitle').html(title);
        $('#messageText').html(text);

        $('#containerMessage').delay(5000).fadeOut('slow');
    });

};

var messageError = function (error) {
    message(error.code, error.message, 'alert-danger');
};

var showUserLoggedComponent = function (user) {
    $('#containerUnlogged').hide();
    $('#containerLogged').show();
    $('#userStatusEmail').html(user.email);
};

var showUserUnloggedComponent = function () {
    $('#containerUnlogged').show();
    $('#containerLogged').hide();
};

var log = function (text) {
    $('#containerLog').html(text);
};
