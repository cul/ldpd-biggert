elasticlunr.Index.prototype.rangeSearch = function (queryTokens, fieldName) {
// range tokens should be 'expanded' to appropriate values
  queryTokens = queryTokens.map(function(x){ return parseInt(x); });
  queryTokens.sort;
  newTokens = new Array(queryTokens[1] - queryTokens[0] + 1).fill(null)
  .map(function(val,ix) { return (ix + queryTokens[0]).toString(); });
  queryTokens = newTokens;
  var userConfig = {fields: {}, boost: 0};
  userConfig.fields[fieldName] = {boost: 1, bool: "OR", expand: false};
  var configStr = JSON.stringify(userConfig);
  var config = new elasticlunr.Configuration(configStr, this.getFields()).get();
  var queryResults = {};

  for (var field in config) {
    var fieldSearchResults = this.fieldSearch(queryTokens, field, config);
    var fieldBoost = config[field].boost;

    for (var docRef in fieldSearchResults) {
      fieldSearchResults[docRef] = fieldSearchResults[docRef] * fieldBoost;
    }

    for (var docRef in fieldSearchResults) {
      if (docRef in queryResults) {
        queryResults[docRef] += fieldSearchResults[docRef];
      } else {
        queryResults[docRef] = fieldSearchResults[docRef];
      }
    }
  }

  var results = [];
  for (var docRef in queryResults) {
    results.push({ref: docRef, score: queryResults[docRef]});
  }

  results.sort(function (a, b) { return b.score - a.score; });
  return results;
};

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