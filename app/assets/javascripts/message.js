$(function() {

  function buildHTML(message){
    if (message.image) {
      let html = `<div class="chat-items">
                    <div class="chat-items__top">
                      <div class="chat-items__top--black">
                        ${message.user_name}
                      </div>
                      <div class="chat-items__top--gray">
                        ${message.created_at} 
                      </div>
                    </div>
                    <div class="chat-items__bottom">
                       <div class="chat-items__bottom__text">
                         ${message.content}
                       </div>
                       <img src= ${message.image}>
                    </div>
                  </div>`
      return html
    } else {
      let html = `<div class="chat-items">
                    <div class="chat-items__top">
                      <div class="chat-items__top--black">
                        ${message.user_name}
                      </div>
                      <div class="chat-items__top--gray">
                        ${message.created_at} 
                      </div>
                    </div>
                    <div class="chat-items__bottom">
                      <div class="chat-items__bottom__text">
                        ${message.content}
                      </div>
                    </div>
                  </div>`
      return html
      }
  }

  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    let url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message) {
      let html = buildHTML(message);
      $('.chat-main__message-list').append(html);
      $('form')[0].reset();
      $('.form-input__btn').prop('disabled', false);
      $('.chat-main__message-list').animate({scrollTop: $('.chat-main__message-list')[0].scrollHeight});
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  });
})