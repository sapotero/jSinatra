require "bundler/capistrano"
# -------------------------------------------
# Stages settings - allows cap [stage] deploy
# -------------------------------------------
set :stages, %w(production)
set :default_stage, :production
require 'capistrano/ext/multistage'
# -------------------------------------------
# Main Configuration
# -------------------------------------------
set :application, "jSinatra"
set :repository,  "https://github.com/sapotero/jSinatra"
set :scm, :git
set :deploy_via, :remote_cache
set :user, :deploy
set :deploy_to, '/opt/jSinatra'
set :branch, fetch(:branch, "master")
set :use_sudo, false
ssh_options[:paranoid] = false
default_run_options[:on_no_matching_servers] = :continue
# -------------------------------------------
# ERB Templates Setup
# -------------------------------------------
after "deploy:update_code", "deploy:resolve_configuration_erbs"
def get_binding
  binding 
end
def from_template(file)
  require 'erb'
  template = File.read(file)
  ERB.new(template).result(self.get_binding)
end
def resolve_template(file)
  resolved_file_name = File.expand_path("../#{file}", __FILE__)
  resolved_content = from_template(resolved_file_name)
  put resolved_content, File.join(release_path, "config", file).gsub(/\.erb$/, "")
end

# -------------------------------------------
# Tasks Definitions
# -------------------------------------------
namespace :deploy do
  desc "Resolves ERB configuration templates"
  task :resolve_configuration_erbs, roles: :app do
    resolve_template("god/unicorn.rb.erb")
    resolve_template("unicorn.rb.erb")
  end

  desc "Starts processes"
  task :start do
    unicorn.start
  end

  desc "Restart processes"
  task :restart do
    unicorn.restart
  end
end
# -------------------------------------------
# Unicorn Tasks
# -------------------------------------------
set :unicorn_pid, "#{shared_path}/pids/unicorn.pid"
namespace :unicorn do
  desc "Restart Unicorn processes"
  task :restart, roles: :web, :except => { :no_release => true } do
    run "kill -s USR2 `cat #{unicorn_pid}`"
  end

  task :start, roles: :web, :except => { :no_release => true } do
    run "cd #{current_path} && bundle exec god -c config/god/unicorn.rb"
  end

  desc "Stops unicorn processes on server"
  task :stop, roles: :web do
    run "kill -s QUIT `cat #{unicorn_pid}`"
  end
end


