---
layout: page
title: Browse the Collection
permalink: /browse/
---

<ul>
{% for item in site.biggert %}
  <li>
    <a href='{{ site.baseurl | append: item.permalink | replace: '//', '/' }}'>
      {{ item.title }}
    </a>
  </li>
{% endfor %}
</ul>
