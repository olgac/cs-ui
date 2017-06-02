(function() {
  $('form').on('submit', function(e) {
    e.preventDefault();

    $.post('/api/login', {
      email: $('#email').val(),
      password: $('#password').val()
    }).done(function(response) {
      if (response.token) {
        localStorage.setItem('token', response.token);
        location.href = '/transactions';
        return;
      }

      alert('Something went wrong!');
    }).fail(function() {
      alert('Something went wrong!');
    });
  });
})();
