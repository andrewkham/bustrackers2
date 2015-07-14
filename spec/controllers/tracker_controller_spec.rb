require 'rails_helper'

RSpec.describe TrackerController, type: :controller do

  describe "GET #map" do
    it "returns http success" do
      get :map
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #info" do
    it "returns http success" do
      get :info
      expect(response).to have_http_status(:success)
    end
  end

end
