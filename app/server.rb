require "sinatra/reloader" if development?
helpers RenderHelpers

get "/" do
  erb :application
end

get "/api" do
  "/api"
end