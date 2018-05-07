lock '3.10.2'

set :department, 'ldpd'
set :application, 'biggert'

set :repo_name, "#{fetch(:department)}-#{fetch(:application)}"
set :repo_url,  "git@github.com:cul/#{fetch(:repo_name)}.git"

set :remote_user, "#{fetch(:department)}serv"

# set :deploy_name, "#{fetch(:application)}_#{fetch(:stage)}"
set :deploy_to, "/opt/passenger/ldpd/dcv_dev/subsites/#{fetch(:application)}"

# Default branch is :master
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
