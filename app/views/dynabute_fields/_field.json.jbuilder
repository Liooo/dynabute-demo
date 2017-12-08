json.extract! field, :id, :name, :value_type, :has_many, :target_model
if field.value_type == 'select'
  json.options do
    json.array! field.options do |option|
      json.extract! option, :id, :label
    end
  end
end
