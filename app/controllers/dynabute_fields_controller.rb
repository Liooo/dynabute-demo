class DynabuteFieldsController < ApplicationController
  before_action :set_dynabute, only: [:show, :edit, :update, :destroy]
  before_action :set_target_model, only: [:index]
  ALLOWED_MODELS = %w(user article)

  # GET /dynabute_fields
  # GET /dynabute_fields.json
  def index
    @dynabute_fields = Dynabute::Field.where(target_model: target_model)
  end

  # GET /dynabute_fields/1
  # GET /dynabute_fields/1.json
  def show
  end

  # GET /dynabute_fields/new
  def new
    @dynabute_field= Dynabute::Field.new(target_model: target_model)
  end

  # GET /dynabute_fields/1/edit
  def edit
  end

  # POST /dynabute_fields
  # POST /dynabute_fields.json
  def create
    @dynabute_field = Dynabute::Field.new(dynabute_params)

    respond_to do |format|
      if @dynabute_field.save
        format.html { redirect_to dynabute_fields_path(@dynabute_field.target_model), notice: 'Dynabute was successfully created.' }
        format.json { render :show, status: :created, location: @dynabute_field}
      else
        format.html { render :new }
        format.json { render json: @dynabute_field.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dynabute_fields/1
  # PATCH/PUT /dynabute_fields/1.json
  def update
    respond_to do |format|
      if @dynabute_field.update(dynabute_params)
        format.html { redirect_to dynabute_fields_path(@dynabute_field.target_model), notice: 'Dynabute was successfully updated.' }
        format.json { render :show, status: :ok, location: @dynabute_field}
      else
        format.html { render :edit }
        format.json { render json: @dynabute_field.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dynabute_fields/1
  # DELETE /dynabute_fields/1.json
  def destroy
    @dynabute_field.destroy
    respond_to do |format|
      format.html { redirect_to dynabute_fields_path(@dynabute_field.target_model), notice: 'Dynabute was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def set_dynabute
      @dynabute_field= Dynabute::Field.find(params[:id])
    end

    def dynabute_params
      params.fetch(:dynabute_field, {}).permit(
        :id,
        :name,
        :target_model,
        :value_type,
        :has_many,
        options_attributes: [:id, :label]
      )
    end

    def target_model
      params[:target_model] && params[:target_model].classify
    end

    def set_target_model
      return render file: "#{Rails.root}/public/404.html", layout: false, status: 404 unless ALLOWED_MODELS.include?(target_model.downcase)
      @target_model = target_model.downcase
    end

end
