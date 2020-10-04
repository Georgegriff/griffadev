---
pagination:
  data: collections.series
  size: 1
  alias: series
  filter:
    - all
    - nav
    - post
    - posts
    - tagList
    - tagNames
    - series
  addAllPagesToCollections: true
layout: layouts/series.njk
callToAction:
  href: '/series/'
  text: 'All series'
eleventyComputed:
  subtitle: "{{ series.title }}"
  subtitleDetail: "{{series.posts.length}} part series"
permalink: /series/{{ series.title |  slug }}/
paginationPrevText: 'Newer series'
paginationNextText: 'Older series'
---