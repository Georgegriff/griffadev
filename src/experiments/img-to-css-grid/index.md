---
layout: layouts/experiment.njk
title: Converting an image to a css grid
description: This an experiment where I use a custom element to convert an uploaded image to css grid format. Uses Lit (Web Components).
date: '2019-03-04'
---
This an experiment where use Web Component to convert an uploaded image to css grid format.
This is just for fun, it works best with low resolution pixel art.

Future improvements might be to see if its possible to move any of the calculations off of the main thread.
If you were to upload an image and inspect it you should see that it gets converted to a css grid layout.

**WARNING**: High scale factors will result in A LOT of DOM nodes, may  cause browser to hang, this is just an experiment.

Feel free to have a play yourself!

<script src="https://unpkg.com/image-q@2.1.2/dist/umd/image-q.js"></script>
<script type="module" src="./assets/img-to-grid.js"></script>
<script type="module" src="./assets/index.js"></script>


<button id="example-1">Example 1</button>
<button id="example-2">Example 2</button>
<img-to-grid totalcolors="8" src="./assets/cat.png"></img-to-grid>
