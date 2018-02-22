$(document).ready(function() {
  $('input#search-text').on('keyup', function () {
    var results_div = $('#results');
    var query = $(this).val();
    var params = {bool: "AND", expand: true};
    if (query.match(/\w+\:.+/)) {
      var fields = query.split(':',2);
      query = fields[1];
      params.fields = {};
      params.fields[fields[0]] =  {boost: 2};
      params.boost = 0;
      console.log(params);
    }
    var results = index.search(query, params);
    
    results_div.empty();

    if (results.length > 20){results_div.prepend("<p><small>Displaying 20 of " + results.length + " results.</small></p>");}
    for (var r in results.slice(0, 19)) { // limit visible results to 20
      var ref     = results[r].ref;
      var item    = store[ref];
      var link    = item.link;
      console.log(link);
      var pid    = link.split('\/')[2];
      var title     = item.title  || '';
      var result  = '<div class="result"><b>' + pid + ':<br><a href="' + link + '">' + title + '</a></b></div>';
      results_div.append(result);
    }
  });
});