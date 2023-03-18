---
subtitle: "All tags"
layout: "layouts/all_tags.njk"
pagination:
  data: collections.tagNames
  size: 30
permalink: "tags{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
paginationPrevText: "Prev page"
paginationNextText: "Next page"
---
