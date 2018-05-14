lock '3.10.2'

set :department, 'ldpd'
set :application, 'biggert'

set :repo_name, "#{fetch(:department)}-#{fetch(:application)}"
set :repo_url,  "git@github.com:cul/#{fetch(:repo_name)}.git"

set :remote_user, "#{fetch(:department)}serv"

set :deploy_to, "/opt/passenger/ldpd/dcv_#{fetch(:stage)}/static_sites/#{fetch(:application)}"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, 's3'

before 'deploy:starting', :jekyll_build_and_push_static_branch do
  run_locally do
    puts
    puts "Enter 'no' if you do NOT want to regenerate the static branch,"
    puts "and instead use the current static branch in the #{fetch(:repo_name)} github repo."
    puts "Default is 'yes', which will regenerate and push the static branch before deploying."
    puts "Any values other than 'no'|'No'|'NO' will also default to 'yes'"
    ask :generate_and_push_static_branch, 'yes'
    puts
    ask :branch, 's3' unless fetch(:generate_and_push_static_branch).downcase.eql?('yes')
    puts "Will deploy branch #{fetch(:branch)}"
  end

  run_locally do
    puts "About to execute 'bundle exec jekyll build'"
    execute 'bundle exec jekyll build'
    puts "Finished executing 'bundle exec jekyll build'"
    puts "About to execute 'bundle exec rake wax:push:static'"
    execute 'bundle exec rake wax:push:static'
    puts "Finisehd executing 'bundle exec rake wax:push:static'"
  end unless fetch(:generate_and_push_static_branch).downcase.eql?('no')
end

