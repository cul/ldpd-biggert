---
layout: page
title: Browse by Company Name
permalink: /companies/
---
{% include search.html %}

<table id="companies" style="margin-top:40px;">
  <th>Company Name</th>
  <th>Item Count</th>
</table>

<script>
  $('#subject-check').prop('checked', true); // set company box to checked by default
</script>

<script>
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  window.company_sort = []
  window.top_ten

  $.getJSON("{{ site.baseurl }}/js/lunr-index.json", function(data) {
    company_data = groupBy(data, 'subject_name');
    for (name in company_data){
      num = company_data[name].length;
      company_sort.push({ 'name': name, 'num': num });
    }
    company_sort = company_sort.sort(function(a,b) {return (a.num < b.num) ? 1 : ((b.num < a.num) ? -1 : 0);} );
    top_ten = company_sort.slice(0,10);
    for (i in top_ten){
      $("#companies").append("<tr><td>" + top_ten[i].name + "</td><td>" + top_ten[i].num + "</td></tr>");
    }
  });

</script>
