# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170831145343) do

  create_table "articles", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_articles_on_user_id"
  end

  create_table "dynabute_boolean_values", force: :cascade do |t|
    t.integer "field_id", limit: 4
    t.integer "dynabutable_id", limit: 4
    t.string "dynabutable_type", limit: 50
    t.boolean "value"
    t.index ["dynabutable_id", "field_id"], name: "dynabute_boolean_values_on_record_id_and_recordable_id"
    t.index ["dynabutable_id"], name: "dynabute_boolean_values_on_recordable_id"
  end

  create_table "dynabute_datetime_values", force: :cascade do |t|
    t.integer "field_id", limit: 4
    t.integer "dynabutable_id", limit: 4
    t.string "dynabutable_type", limit: 50
    t.datetime "value"
    t.index ["dynabutable_id", "field_id"], name: "dynabute_datetime_values_on_record_id_and_recordable_id"
    t.index ["dynabutable_id"], name: "dynabute_datetime_values_on_recordable_id"
  end

  create_table "dynabute_fields", force: :cascade do |t|
    t.string "name", limit: 50
    t.string "value_type", limit: 15
    t.boolean "has_many", default: false
    t.string "target_model", limit: 50
    t.index ["target_model", "name"], name: "index_dynabute_fields_on_target_model_and_name"
  end

  create_table "dynabute_integer_values", force: :cascade do |t|
    t.integer "field_id", limit: 4
    t.integer "dynabutable_id", limit: 4
    t.string "dynabutable_type", limit: 50
    t.integer "value"
    t.index ["dynabutable_id", "field_id"], name: "dynabute_integer_values_on_record_id_and_recordable_id"
    t.index ["dynabutable_id"], name: "dynabute_integer_values_on_recordable_id"
  end

  create_table "dynabute_options", force: :cascade do |t|
    t.integer "field_id", limit: 4
    t.string "label"
    t.index ["field_id"], name: "index_dynabute_options_on_field_id"
  end

  create_table "dynabute_select_values", force: :cascade do |t|
    t.integer "field_id", limit: 4
    t.integer "dynabutable_id", limit: 4
    t.string "dynabutable_type", limit: 50
    t.integer "value"
    t.index ["dynabutable_id", "field_id"], name: "dynabute_select_values_on_record_id_and_recordable_id"
    t.index ["dynabutable_id"], name: "dynabute_select_values_on_recordable_id"
  end

  create_table "dynabute_string_values", force: :cascade do |t|
    t.integer "field_id", limit: 4
    t.integer "dynabutable_id", limit: 4
    t.string "dynabutable_type", limit: 50
    t.string "value", limit: 255
    t.index ["dynabutable_id", "field_id"], name: "dynabute_string_values_on_record_id_and_recordable_id"
    t.index ["dynabutable_id"], name: "dynabute_string_values_on_recordable_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
