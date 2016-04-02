require "sinatra/reloader" if development?

get "/user" do
  "Hello World! USER"
end