---
title: "Hello there, I'm George Griffiths."
subtitle: "I write about and work with web technologies."
layout: "layouts/about.njk"
permalink: "{{ myurl }}/index.html"
pagination:
  data: mypages
  alias: myurl
  size: 1
eleventyNavigation:
  image: img/about.svg
  key: Me
  order: 2
mypages:
  - me
  - about
---
