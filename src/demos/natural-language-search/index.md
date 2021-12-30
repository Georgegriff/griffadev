---
layout: layouts/experiment.njk
title: Natural language post search
date: "2021-03-20"
---

_This is a Machine Learning experiment, check out the blog post and code for this [here](https://griffa.dev/posts/natural-language-search-for-blog-posts-using-tensorflowjs/)._

First time load of the model is initially slow, then subsequent searches are faster, one way to improve this might be with caching and/or a service worker.

This isn't intended as realistic/production example it was just for fun.

Below I've auto populated the Search box with an example query, feel free to have a play!

<form>
<fieldset class="search-inputs" disabled>
    <input class="input-field" type="text" placeholder="Search for posts" id="search">
    <button class="demo-button">Search</button>
</fieldset>    
<griff-loader></griff-loader>
</form>
<ol id="results"></ol>

<script type="module" src="./assets/index.js"></script>

<style>
</style>
