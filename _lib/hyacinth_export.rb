require 'csv'

module Hyacinth
  module Export
    EMPTY_HASH = {}.freeze
    def self.dereference(pointer, root={})
      pointer.inject(root) { |m, o| m[o] }
    end

    def self.shadow(pointer, new_path, value, root={})
      if pointer[-1].is_a? Integer
        dereference(pointer[0...-2], root).tap do |doc|
          doc[new_path] ||= []
          doc[new_path][pointer[-1]] = value
        end
      else
        dereference(pointer[0...-1], root)[new_path] = value
      end
    end

    def self.flatten_values(root, pointer=[])
      keys = nil
      doc = dereference(pointer, root)
      if doc.is_a? Hash
        if doc["title"]
          doc["sort_title"] = doc["title"].map {|title| title["sort_portion"] }.first
          doc["title"] = doc["title"].map do |title|
            (title.fetch("non_sort_portion", '') + ' ' + title["sort_portion"]).strip
          end
        end
        keys = doc.keys
      elsif doc.is_a? Array
        keys = (0...doc.length)
      end
      if keys
        keys.each do |key|
          if key == 'name'
            names = doc[key]
            new_keys = []
            names.each do |name|
              if roles = name.fetch('name_role',[])
                roles = roles.map {|role| role.fetch('term',EMPTY_HASH)['value'] }
                roles.compact!
                roles.each do |role|
                  new_key = "name_#{role.downcase}"
                  new_keys << new_key
                  doc[new_key] ||= []
                  doc[new_key] << name
                end
                doc[key].delete(name) unless roles.empty?
              end
            end
            new_keys.uniq!
            new_keys.each {|new_key| flatten_values(root,pointer[0...-1] + [new_key])}
            flatten_values(root, pointer + [key])
          elsif key == 'subject_hierarchical_geographic'
            # this is an array of values
            value = doc[key].map {|geo| geo['coordinates_value']}.compact
            shadow(pointer + [key], 'coordinates', value, root)
            doc[key] = doc[key].map {|geo| flatten_geo(geo)}.flatten
          elsif key == 'location'
            doc[key].each_with_index do |loc, ix|
              if loc.fetch('location_shelf_location',[]).detect {|x| x['call_number'] }
                loc.delete('location_shelf_location').each do |shelf|
                  #this will only pick up one shelf location per
                  shadow(pointer + [key, ix], 'call_number', shelf['call_number'], root)
                end
              end
              flatten_values(root, pointer + [key])
            end
          else
            if doc[key].is_a? Hash and doc[key]['term']
              data = doc[key]
              doc[key] = data['term'] || data['value']
              ['authority','type','term','value'].each { |x| data.delete(x) }
              data.each do |k,v|
                shadow(pointer + [key], "#{k.downcase}",flatten_values(data,[k]), root)
              end
            end
            if doc[key].is_a? Hash and doc[key]['value'] || doc[key]['string_key'] # just flatten all those URIs to their values
              doc[key] = doc[key]['value'] || doc[key]['string_key']
            end
            flatten_values(root, pointer + [key])
          end
        end
      end
      doc
    end

    def self.flatten_geo(doc)
      # country_text_value?, state_text_value?, province_text_value?,
      # subject_hierarchical_geographic_city*, borough_text_value
      doc.fetch('subject_hierarchical_geographic_city',[EMPTY_HASH]).map do |city|
        city = city['value']
        [city, doc['state_text_value'], doc['province_text_value'],doc['country_text_value']].compact.join(', ')
      end
    end

    def self.to_json(path, io=$stdout)
      docs = []
      CSV.foreach(path, headers: true) do |row|
        doc = {}
        doc['fedora_pid'] = row.delete('_pid')[1] # returns a two item array
        doc['doi'] = row.delete('_doi')[1] # returns a two item array
        row.headers.each do |key|
          next unless row[key]
          parts = key.split(':')
          # subject_hierarchical_geographic-2:subject_hierarchical_geographic_city-1:subject_hierarchical_geographic_city_value
          ctx = parts[0...-1].inject(doc) do |m, part|
            ix = nil
            if part =~ /-\d+/
              _parts = part.split('-')
              ix = _parts[-1].to_i - 1 # hyacinth indexes are 1 offset
              part = _parts[0...-1].join('-')
            end
            if ix.nil?
              m[part] ||= {}
            else
              m[part] ||= []
              m[part][ix] ||= {}
            end
          end
          att = parts[-1].split('.')
          if parts.length > 1
            prefix = parts[-2].gsub(/-\d+$/,'')
            att.each {|a| a.gsub!(prefix + '_','') if a.index(prefix) == 0 }
          end
          if att.length > 1
            ix = nil
            if att[0]  =~ /-\d+/
              _parts = att[0].split('-')
              ix = _parts[-1].to_i - 1 # hyacinth indexes are 1 offset
              att[0] = _parts[0...-1].join('-')
            end
            if ix.nil?
              ctx = (ctx[att[0]] ||= {})
            else
              ctx[att[0]] ||= []
              ctx = (ctx[att[0]][ix] ||= {})
            end
          end
          ix = nil
          if att[-1] =~ /-\d+/
            _parts = att[-1].split('-')
            ix = _parts[-1].to_i - 1 # hyacinth indexes are 1 offset
            att[-1] = _parts[0...-1].join('-')
          end
          if row[key]
            if ix.nil?
              ctx[att[-1]] = row[key]
            else
              ctx[att[-1]] ||= []
              ctx[att[-1]][ix] = row[key]
            end
          end
        end

        docs << flatten_values(doc)
      end
      a = docs[0]
      common_values = a.keys.select { |key| !docs.detect {|d| d[key] != a[key] } }
      docs.each { |d| common_values.each {|key| d.delete(key) } }
      keys_to_flatten = a.keys
      docs.each do |d|
        a.keys.each { |key| keys_to_flatten.delete(key) unless d[key].is_a? Array and d[key].length == 1 }
      end
      docs.each { |d| keys_to_flatten.each { |key| d[key] = d[key][0] } }
      docs
    end
  end
end
