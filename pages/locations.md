---
layout: page
title: Browse by Location
permalink: /locations/
---
{% assign locs = "" %}
{% for item in site.biggert %}
  {% for loc in item.subject_hierarchical_geographic %}
    {% assign locs = locs | append: loc | append: '^' %}
  {% endfor %}
{% endfor %}
{% assign size = locs | size | minus: 1 %}
{% assign locs = locs | slice: 0, size %}
{% assign locs = locs | split: "^" | uniq | sort %}

<ul>
{% for loc in locs %}
  <li>{{ loc }}</li>
{% endfor %}
</ul>
