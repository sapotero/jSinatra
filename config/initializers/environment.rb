require 'yaml'
set :views,         settings.root + '/app/views'
set :public_folder, settings.root + '/app/assets'

env = Sinatra::Base.settings.environment
CONFIG = YAML::load(File.open(File.join(ROOT_PATH, "config", "environments", "#{env}.yml")))