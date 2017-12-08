json.extract! user, :id, :name, :created_at, :updated_at
json.dynabute_values do
  json.array! user.dynabute_values do |value|
    json.extract! value, :id, :value, :field_id
  end
end
