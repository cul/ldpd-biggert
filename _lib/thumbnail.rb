require 'json'
require 'uri'
require 'net/http'

def thumbnail(doi)
  num = rand(1...4)
  uri = "https://derivativo-#{num}.library.columbia.edu/iiif/2/presentation/#{doi}/manifest.json"
  res = Net::HTTP.get_response(URI.parse(uri))
  if res.code == '200'
    manifest = JSON.parse(res.body)
    thumb = manifest['thumbnail']['@id']
  else
    thumb = false
  end
  thumb
end
