# wax_tasks
spec = Gem::Specification.find_by_name 'wax_tasks'
Dir.glob("#{spec.gem_dir}/lib/tasks/*.rake").each {|r| load r}

# custom
require 'json'

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
  Dir.mkdir('js') unless Dir.exist?('js')
  File.open("js/map-markers.json","w") { |f|f.write("---\nlayout: none\n---\n"+JSON.pretty_generate(markers)) }
end
