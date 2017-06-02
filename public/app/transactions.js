(function(){
  var getData = function(payload, callback) {
    $.ajax({
      url: '/api/transactions/get-info',
      type: 'POST',
      data: {
        type: payload.type,
        transactionId: payload.transactionId
      },
      beforeSend: function(xhr) {
        const token = localStorage.getItem('token');
        xhr.setRequestHeader('X-AUTH-TOKEN', token);
      },
      success: function(response) {
        callback(response);
      }
    });
  };

  var $buttons = $('.transactions .item td.buttons .btn');

  $buttons.on('click', function(e) {
    var $this = $(this);
    const tid = $this.data('tid');
    const type = $this.data('type');
    const payload = {
      type: type,
      transactionId: tid
    };

    getData(payload, function(response) {
      alert(JSON.stringify(response));
    });
  });
})();
