Rails.application.routes.draw do
  root :to => 'users#index'
  resources :articles
  resources :users
  scope path: '(:target_model)', shallow_path: '(:target_model)' do
    resources :dynabute_fields, except: [:update, :edit]
  end
end
