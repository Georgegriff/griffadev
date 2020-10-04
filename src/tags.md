---
layout: layouts/tags.njk
permalink: tags/{{ paged.name | slug }}/{% if paged.index > 0 %}page/{{ paged.pageNumber }}{% endif %}/index.html
pagination:
  data: collections.tagList
  size: 1
  alias: paged
callToAction:
  href: '/tags/'
  text: 'All tags'
eleventyComputed:
  subtitle: "#{{ paged.name }}"
---