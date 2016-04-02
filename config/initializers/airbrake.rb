require 'sinatra'
require 'airbrake'

configure :production do
  Airbrake.configure do |config|
    config.api_key = 'API Key'
  end
  use Airbrake::Rack
  enable :raise_errors
end

