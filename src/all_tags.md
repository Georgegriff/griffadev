---
subtitle: "All tags"
layout: "layouts/all_tags.njk"
pagination:
  data: collections
  size: 5 
  filter:
    - all
    - nav
    - post
    - posts
    - tagList
    - series
permalink: 'tags{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
paginationPrevText: 'Prev page'
paginationNextText: 'Next page'
---

