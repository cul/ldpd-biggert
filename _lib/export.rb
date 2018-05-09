$LOAD_PATH.unshift('_lib')
require 'json'
require 'hyacinth_export'

docs = Hyacinth::Export.to_json('_data/hyacinth-biggert.csv')
docs.each do |doc|
  doc['pid'] = doc['_identifiers']
  doc['_identifiers'].delete(doc['pid'])
  ids = doc.delete('_identifiers')
  doc['identifiers'] = ids unless ids.empty?
  doc['canvas_id'] = doc['fedora_pid']
  doc.delete('fedora_pid')
  doc['doi'] = doc['doi'].tr('doi:','')
end
$stdout.puts JSON.pretty_generate(docs)
