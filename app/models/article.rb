class Article < ApplicationRecord
  has_dynabutes
  belongs_to :user
  validates :title, presence: true
end
