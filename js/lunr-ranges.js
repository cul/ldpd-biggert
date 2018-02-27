---
layout: none
---
elasticlunr.Index.prototype.rangeSearch = function (queryTokens, fieldName) {
// range tokens should be 'expanded' to appropriate values
  queryTokens = queryTokens.map(function(x){ return parseInt(x); });
  queryTokens.sort;
  queryTokens = elasticlunrRanges.ordinalTokenRange(this.index[fieldName], queryTokens[0].toString(),queryTokens[1].toString());
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

elasticlunr.Index.prototype.mapSearch = function (west, south, east, north) {
// range tokens should be 'expanded' to appropriate values
  west = elasticlunrRanges.absoluteOrdinal(west.toString(),180);
  south = elasticlunrRanges.absoluteOrdinal(south.toString(),90);
  east = elasticlunrRanges.absoluteOrdinal(east.toString(),180);
  north = elasticlunrRanges.absoluteOrdinal(north.toString(),90);
  var tokens = {
    lat : elasticlunrRanges.ordinalTokenRange(this.index['lat'], south,north),
    lon : elasticlunrRanges.ordinalTokenRange(this.index['lon'], west,east)
  }
  var userConfig = {fields: {}, boost: 0};
  userConfig.fields['lat'] = {boost: 1, bool: "OR", expand: false};
  userConfig.fields['lon'] = {boost: 1, bool: "OR", expand: false};
  var configStr = JSON.stringify(userConfig);
  var config = new elasticlunr.Configuration(configStr, this.getFields()).get();
  var fieldResults = {lat: {}, lon: {}};
  var index = this;
  ['lat','lon'].forEach (
    function(fieldName) {
      var queryTokens = tokens[fieldName] || [];
      var queryResults = fieldResults[fieldName];
      var fieldSearchResults = index.fieldSearch(queryTokens, fieldName, config);
      var fieldBoost = config[fieldName].boost;

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
  );

  var results = [];
  for (var docRef in fieldResults['lon']) {
    if (docRef in fieldResults['lat']) {
      results.push({ref: docRef, score: fieldResults['lat'][docRef] + fieldResults['lon'][docRef]});
    } else {
    }
  }

  results.sort(function (a, b) { return b.score - a.score; });
  return results;
};

var elasticlunrRanges = function() {};

// function to process doc with separated lat and lon
elasticlunrRanges.absoluteOrdinal = function(coord, offset) {
  var num  = coord.split('.')[0];
  var frac = coord.split('.')[1];
  num = parseInt(num) + offset;
  // ugliness to deal with the negative fractions
  if (num <= offset) {
    num = num - 1;
    frac = (1 - Number.parseFloat("0." + frac)).toPrecision(6);
  } else {
    frac = Number.parseFloat("0." + frac).toPrecision(6); // keep 5 decimal digits
  }
  num = num.toString().padStart(3,'0');
  return num + frac.slice(frac.indexOf('.')).padEnd(6,'0');
}

elasticlunrRanges.splitCoords = function(doc) {
  var lat = [];
  var lon = [];
  if (doc['coordinates']) {
    coords = (Array.isArray(doc['coordinates'])) ? doc['coordinates'] : Array.of(doc['coordinates']);
    coords.map(
      function(val) {
        vals = val.split(',');
        lat.push(elasticlunrRanges.absoluteOrdinal(vals[0],90));
        lon.push(elasticlunrRanges.absoluteOrdinal(vals[1],180));
      }
    );
  }
  doc['lat'] = lat;
  doc['lon'] = lon;
  return doc;
}

elasticlunrRanges.expandTokenRange = function(token, memo, invIndex, min, max, root) {
  if (token == null || token == '') return [];
  var memo = memo || [];

  if (root == void 0) {
    root = invIndex.getNode(token);
    if (root == null) return memo;
  }

  if (root.df > 0) memo.push(token);

  for (var key in root) {
    if (key === 'docs') continue;
    if (key === 'df') continue;
    var candidate = token + key;
    // skip if outside the range, unless it's a prefix of min
    if ((candidate < min || candidate > max) && min.indexOf(candidate) != 0) {
      continue;
    }
    this.expandTokenRange(candidate, memo, invIndex, min, max, root[key]);
  }

  return memo;
}

elasticlunrRanges.ordinalTokenRange = function(invIndex, min, max) {
  var ix = 0;
  for(ix; ix < min.length && min.slice(0,ix) == max.slice(0,ix); ix++);
  var prefix = (ix > 1) ? min.slice(0,ix - 1) : "";
  var prefixes = (prefix.length == 0) ? ['0','1','2'] : [prefix];
  var newTokens = [];
  var reducer = function(candidate) {
  if (candidate.length == min.length &&
      candidate <= max &&
      min <= candidate) newTokens.push(candidate);
  };
  var memo = { push: reducer};
  prefixes.map(p => this.expandTokenRange(p, memo, invIndex, min, max));
  return newTokens;
}
