---
layout: layouts/experiment.njk
title: Natural language post search
date: '2021-03-20'
---

*This is a Machine Learning experiment, check out the blog post and code for this [here](https://griffa.dev/posts/).*

First time load of the model is initially slow, then subsequent searches are faster, one way to improve this might be with caching and/or a service worker.

This isn't intended as realistic/production example it was just for fun.

<form>
<input disabled type="text" placeholder="Search for posts" id="search">
<button>Search</button>
<griff-loader></griff-loader>
</form>
<ol id="results"></ol>

<script type="module" src="./assets/index.js"></script>

<style>
</style>