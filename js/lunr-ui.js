---
layout: none
---
// get index json
$.getJSON("{{ site.baseurl }}/js/lunr-index.json", function(index_json) {
  // create elasticlunr index
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
  index.addField('lat');
  index.addField('lon');

  // add docs
  for (i in store) {index.addDoc(elasticlunrRanges.splitCoords(store[i]));}
  // range search

  // interaction
  $('input#search').on('keyup', function () {
    var results_div = $('#results');
    var query = $(this).val();
    var params = {bool: "AND", expand: true};
    if (query.match(/\w+\:.+/)) {
      var fields = query.split(':',2);
      query = fields[1];
      params.fields = {};
      params.fields[fields[0]] =  {boost: 2};
      params.boost = 0;
    }
    var results = null;
    if (query.match(/\d+[-]\d+/)) {
      results = index.rangeSearch(query.split(/[-]/),'date_other');
    } else {
      results = index.search(query, params);
    }

    results_div.empty();

    if (results.length > 20){results_div.prepend("<p><small>Displaying 20 of " + results.length + " results.</small></p>");}
    for (var r in results.slice(0, 19)) { // limit visible results to 20
      var ref     = results[r].ref;
      var item    = store[ref];
      var link    = item.link;
      var pid    = link.split('\/')[2];
      var title     = (item.title  || '');
      if (item.date_other) {
        title = title + ' (' + item.date_other + ')';
      }
      var result  = '<div class="result"><b>' + pid + ':<br><a href="' + link + '">' + title + '</a></b></div>';
      results_div.append(result);
    }
  });
});
