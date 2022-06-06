require 'rspec'
require 'selenium/webdriver'
require 'capybara/dsl'
require 'rack/jekyll'
require 'rack/test'
# Require 'webdrivers/chromedriver' so that chromedriver is automatically installed/updated
require 'webdrivers/chromedriver'

RSpec.configure do |config|
  config.include Capybara::DSL

  Capybara.javascript_driver = :selenium_chrome_headless
  Capybara.app = Rack::Jekyll.new(:force_build => false)
  Capybara.server = :webrick
end
