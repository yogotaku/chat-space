#名前空間をApiに指定したクラス名をつける
class Api::MessagesController < ApplicationController
  def index
    group = Group.find(params[:group_id])
    last_message_id = params[:id].to_i  #jsファイル、ajaxのdataで送信したので取得できる
    @messages = group.messages.includes(:user).where("id > ?", last_message_id)
  end
end