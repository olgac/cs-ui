(function() {
  if (!localStorage.getItem('token')) {
    alert('Unauthorized Access!');
    location.href = '/';
  }
})();
