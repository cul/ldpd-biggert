---
layout: none
---
$.getJSON("{{ site.baseurl }}/js/lunr-index.json", function(index_json) {
  window.index = new elasticlunr.Index;
  window.store = index_json;
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
  // add docs
  for (i in store) {
    index.addDoc(store[i]);
  }
  $('input#search').on('keyup', function() {
    var results_div = $('#results');
    var query = $(this).val();
    var results = index.search(query, {
      boolean: 'AND',
      expand: true
    });
    results_div.empty();
    if (results.length > 10) {
      results_div.prepend("<p><small>Displaying 10 of " + results.length + " results.</small></p>");
    }
    for (var r in results.slice(0, 9)) {
      var ref = results[r].ref;
      var item = store[ref];
      var pid = item.pid;
      var date_other = item.date_other;
      var sort_title = item.sort_title;
      var title = item.title;
      var subject_hierarchical_geographic = item.subject_hierarchical_geographic;
      var subject_name = item.subject_name;
      var genre = item.genre;
      var coordinates = item.coordinates;
      var call_number = item.call_number;
      var doi = item.doi;
      var result = '<div class="result"><b><a href="' + item.link + '">' + title + '</a></b></p></div>';
      results_div.append(result);
    }
  });
});
