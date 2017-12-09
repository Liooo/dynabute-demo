class Article < ApplicationRecord
  has_dynabutes
  validates :name, presence: true
end
