---
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
    - nav
    - post
    - posts
    - tagList
  addAllPagesToCollections: true
layout: layouts/tags.njk

eleventyComputed:
  subtitle: "#{{ tag }}"
permalink: /tags/{{ tag |  slug }}/
---