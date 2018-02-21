---
layout: page
title: Browse by Company Name
permalink: /companies/
---
{% assign companies = "" %}
{% for item in site.biggert %}
  {% for name in item.subject_name %}
    {% assign companies = companies | append: name | append: '^' %}
  {% endfor %}
{% endfor %}
{% assign size = companies | size | minus: 1 %}
{% assign companies = companies | slice: 0, size %}
{% assign companies = companies | split: "^" | uniq | sort %}

<ul>
{% for company in companies %}
  <li>{{ company }}</li>
{% endfor %}
</ul>
 
