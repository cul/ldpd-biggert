$LOAD_PATH.unshift('_lib')
require 'json'
require 'hyacinth_export'

docs = Hyacinth::Export.to_json('_data/biggert-items.csv')
docs.each do |doc|
  doc['pid'] = doc['_identifiers'].detect {|x| x =~ /ave_biggert_\d+/}
  doc['_identifiers'].delete(doc['pid'])
  ids = doc.delete('_identifiers')
  doc['identifiers'] = ids unless ids.empty?
  doc.delete('fedora_pid')
end
$stdout.puts JSON.pretty_generate(docs)