
  var ajax = function(layout, done) {
    $.ajax({
      method: "GET",
      url: '/' + layout + '.html?' + $.now()
    }).done(done);
  };

  var modal = function(html) {
    $('#containerModal').html(html);
    $('#myModal').modal('show');
  };

  var content = function(html) {
    $('#containerContent').html(html);
  };

  var modalHide = function() {
    $('#myModal').modal('hide')
  };

  var message = function(title, text, type) {

    ajax('components/message', function(html) {

      $('#containerMessage').html(html);

      $('#message').attr('class', 'alert ' + type);
      $('#messageTitle').html(title);
      $('#messageText').html(text);

      $('#containerMessage').delay(5000).fadeOut('slow');
    });

  };

  var log = function(text) {
    $('#containerLog').html(text);
  };
