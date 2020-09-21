---
subtitle: "Post series"
layout: "layouts/all_series.njk"
pagination:
  data: collections.series
  size: 15
permalink: 'series{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
paginationPrevText: 'Newer series'
paginationNextText: 'Older series'
---

