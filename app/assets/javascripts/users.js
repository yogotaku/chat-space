$(function() {

  //関数の定義
  function addUser(user) {  //インクリメンタルサーチで候補が見つかったときの表示
    let html = `
                <div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${user.id} data-user-name=${user.name}>追加</div>
                </div>
                `
    $('#user-search-result').append(html);
  }

  function addNoUser() {  // インクリメンタルサーチで候補が見つからなかったときの表示
    let html = `
                <div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">ユーザーが見つかりません</p>
                </div>
                `
    $('#user-search-result').append(html);
  }  

  function selectedUser(userName, userId) { //追加ボタンを押したときのビュー
    let html = `
                <div class='chat-group-user'>
                  <input name='group[user_ids][]' type='hidden' value=${userId}> 
                  <p class='chat-group-user__name'>${userName}</p>
                  <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>
               `
    $('#chat-group-users').append(html);
  }




  //  インクリメンタルサーチの実装
  $('#user-search-field').on('keyup', function() {
    let input = $(this).val();

    let members = $("input[name='group[user_ids][]']").map(function(){
                   return $(this).val();
                  });
    let memberIds = members.get();
  

    $.ajax({
      type: 'GET',
      url: '/users',
      dataType: 'json',
      data: {keyword: input, 
             ids: memberIds
            }
    })

    .done(function(users) {
      $('#user-search-result').empty();
      if (users.length !== 0) {
        users.forEach(function(user) {
          addUser(user);
        });
      } else if (input.length == 0) { // 文字が入力されていない場合の分岐
        return false
      } 
      else {
          addNoUser();
      }
    })

    .fail(function(){
      alert("ユーザー検索に失敗しました");
    })
  });



  //追加ボタンを押した際の挙動の実装
  $('#user-search-result').on('click', '.chat-group-user__btn', function() {
    $(this).parent().remove();  //追加候補から削除
    let name = $(this).data('userName');
    let id   = $(this).data('userId');
    selectedUser(name, id)
  })


  //削除ボタンを押した際の挙動の実装
  $('#chat-group-users').on('click', '.chat-group-user__btn', function() {
    $(this).parent().remove();
  })
});