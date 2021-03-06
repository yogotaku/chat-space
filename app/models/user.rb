class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :group_users
  has_many :groups, through: :group_users
  has_many :messages

  validates :name, presence: true, uniqueness: true

  def self.search(input, ids, id)
    # binding.pry
    return nil if input == "" #この文が無いと検索ボックスを空にした時に全ユーザーが表示される
    User.where("name LIKE ?", "%#{input}%").where.not(id: ids).where.not(id: id).limit(10)
  end
end
