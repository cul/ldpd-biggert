require 'json'
require 'fileutils'

desc "generate json for map markers"
task :markers do
  markers = []
  data = JSON.parse(File.read('_data/biggert-items.json'))
  data.each do |item|
    marker = {
      'title' => item['title'].tr("'", ""),
      'coordinates' => item['coordinates'].each{ |c| c.tr!('°','') },
      'link' => '{{ site.baseurl }}/biggert/' + item['pid'] + '/',
      'thumbnail' => item['thumbnail']
    }
    markers << marker
  end
  FileUtils::mkdir_p "js"
  File.open("js/map-markers.json","w") { |f|f.write("---\nlayout: none\n---\n"+JSON.pretty_generate(markers)) }
  puts "Generated js/map-markers.json."
end
