module ApplicationHelper
  def dynabute_value_text(value, field)
    return '' if value.blank?
    if field.has_many
      value.map{|v| value_text(v, field) }.join(',')
    else
      value_text(value, field)
    end
  end

  private
  def value_text(value, field)
    field.value_type == 'select' ? value.option.label : value.value
  end
end
