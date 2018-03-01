---
layout: none
---
// get index json
$.getJSON("{{ site.baseurl }}/js/lunr-index.json", function(index_json) {
  // create elasticlunr index
  window.index = new elasticlunr.Index;
  window.store = index_json;
  window.selected = []
  window.results_div = $('#results');
  window.search_input = $('input#search');

  index.saveDocument(false);
  index.setRef('lunr_id');
  index.addField('pid');
  index.addField('date_other');
  index.addField('sort_title');
  index.addField('title');
  index.addField('subject_hierarchical_geographic');
  index.addField('subject_name');
  index.addField('genre');
  index.addField('coordinates');
  index.addField('call_number');
  index.addField('doi');
  index.addField('lat');
  index.addField('lon');

  // add docs
  for (i in store) {index.addDoc(elasticlunrRanges.splitCoords(store[i]));}

  // interaction
  search_input.on('keyup', function () {
    var query = $(this).val();
    var params = {bool: "AND", expand: true};
    for (s in selected){
      params.fields = {};
      params.fields[selected[s]] = {boost: 2};
      params.boost = 0;
    }
    var results = null;
    if (query.match(/\d+[-]\d+/)) {
      results = index.rangeSearch(query.split(/[-]/),'date_other');
    } else {
      results = index.search(query, params);
    }
    results_div.empty();
    results_div.prepend("<p><small>Displaying " + results.length + " results.</small></p>");
    for (var r in results) {
      var ref     = results[r].ref;
      var item    = store[ref];
      var link    = item.link;
      var pid     = link.split('\/')[2];
      var title   = (item.title  || '');
      var meta    = []
      if (item.date_other != 'unknown') { meta.push('c.'+ item.date_other);}
      if (item.subject_hierarchical_geographic) { meta.push(item.subject_hierarchical_geographic);}
      if (item.subject_name) { meta.push(item.subject_name);}
      if (item.genre) { meta.push(item.genre);}
      if (item.call_number) { meta.push(item.call_number);}
      var result  = '<div class="result"><b><a href="' + link + '">' + title + '</a></b><br>' + meta.join('&nbsp;&nbsp;|&nbsp;&nbsp;') + '</div>';
      results_div.append(result);
    }
  });
  // On checked
  $( "input[name='search-field']" ).on( "click", function(event) {
    results_div.empty();
    selected = []
    $('#checkboxes input:checked').each(function() {selected.push($(this).attr('value'));});
  });
});
