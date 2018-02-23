require 'json'
require 'fileutils'

desc "generate iiif collection.json of available manifests"
task :iiif_collect do
  collection = {
    "@context"  => "http://iiif.io/api/presentation/2/context.json",
    "@type"     => "sc:Collection",
    "@id"       => "{{ site.url }}{{ site.baseurl }}/iiif/biggert/collection.json",
    "label"     => "The Biggert Collection of Architectural Vignettes",
    "manifests" => []
  }
  data = JSON.parse(File.read('_data/biggert-items.json'))
  data.each do |item|
    num = rand(1...4)
    manifest = {
      "@id"   => "https://derivativo-#{num}.library.columbia.edu/iiif/2/presentation/#{item['doi']}/manifest.json",
      "@type" => "sc:Manifest",
      "label" => item['title']
    }
    collection['manifests'] << manifest
  end
  FileUtils::mkdir_p "iiif/biggert/"
  File.open("iiif/biggert/collection.json","w") { |f|f.write("---\nlayout: none\n---\n"+JSON.pretty_generate(collection)) }
  puts "Writing collection.json to iiif/biggert"
end
