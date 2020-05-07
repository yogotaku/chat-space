$(function() {

  // メッセージ送信成功時に追加されるHTML要素の作成
  function buildHTML(message){
    if (message.image) {
      // 画像が添付されていた場合
      let html = `<div class="chat-items", data-message-id=${message.id}>
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
      // 画像が添付されていなかった場合
      let html = `<div class="chat-items", data-message-id=${message.id}>
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

  // 非同期通信によるメッセージ送信機能
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
      // console.log($('.chat-main__message-list')[0])
      $('.chat-main__message-list').animate({scrollTop: $('.chat-main__message-list')[0].scrollHeight});
    })

    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  });


  //自動更新機能の実装
  let reloadMessages = function() {
    let last_message_id = $('.chat-items:last').data('message-id');
    $.ajax({
      url: 'api/messages',
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        // 追加するHTMLの入れ物を作る
        let insertHTML = '';
        // 配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        })
        // メッセージが入ったHTMLに、入れ物ごと追加
        $('.chat-main__message-list').append(insertHTML);
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    })
  }

  //urlがgroups/数字/messagesとマッチする場合のみ、7秒ごとにreloadMessagesを動かす
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
})