$LOAD_PATH.unshift('_lib')
require 'json'
require 'hyacinth_export'
require 'thumbnail'
require 'tqdm'

docs = Hyacinth::Export.to_json('_data/biggert-items.csv')
docs.tqdm.each do |doc|
  doc['pid'] = doc['_identifiers']
  doc['_identifiers'].delete(doc['pid'])
  ids = doc.delete('_identifiers')
  doc['identifiers'] = ids unless ids.empty?
  doc.delete('fedora_pid')
  doc['doi'] = doc['doi'].tr('doi:','')
  doc['thumbnail'] = thumbnail(doc['doi'],rand(1...4))
  doc['coordinates'].each{ |c| c.tr!(c,"'"+c+"'") } # wrap coordinates in quotes bc yaml gets mad at the commas
end
$stdout.puts JSON.pretty_generate(docs)
