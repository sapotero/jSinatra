require 'yaml'
set :views, settings.root + '/views'


env = Sinatra::Base.settings.environment
CONFIG = YAML::load(File.open(File.join(ROOT_PATH, "config", "environments", "#{env}.yml")))