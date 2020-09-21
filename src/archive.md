---
layout: layouts/archive.njk
title: Archive
subtitle: Archive
callToAction:
  href: '/'
  text: 'Recent activity'
pagination:
  data: collections.archive
  size: 15
paginationPrevText: 'Newer posts'
paginationNextText: 'Older posts'
permalink: 'posts{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
---
