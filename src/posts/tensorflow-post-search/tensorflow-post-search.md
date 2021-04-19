---
title: Playing with Natural language search for blog posts using TensorflowJS
description: I've been learning TensorflowJS and Machine Learning, as an experiment I thought I would implement a naive search across my current blog posts using sentence similarity on natural language running in the browser.
tags:
  - JavaScript
  - MachineLearning
  - TensorflowJS
  - 11ty
date: '2021-04-19'
hero:
  image: /images/demo-tf-search-screenshot.png
  alt: "Demo application showing search results for Natural language search of blog posts"
---
- Create small snippets of functional code.
- Explain input data, summary sentences only, not blog content.
- Running in the browser benefits/tradeoffs. Running on the GPU
- Explain not a good way to do search, just an experiment
- Exposing blog posts as an API with 11ty
- Link out json feed spec and 11ty blog starter
- TF JS models universal-sentence-encoder, show example of similarity of sentences
- Show problem though my maths that added was not on the gpu
- Dot product implementation explanation
- Blocking the main thread
- Using Comlink
- Productionize thoughts
- Future ideas for experiments: Text summarization of blog posts
- link to other resources


I hope this was a good read, if you feel like reading more of my work, please follow me on Twitter [@griffadev](https://twitter.com/griffadev), or get me a [coffee](https://ko-fi.com/griffadev) if you feel like it ☕. 

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder"></script>

```js basic-example
<p>Input: how to use css to make a grid layout of cards</p>
<div id="basic-example-results"></div>
```

```js basic-example
/**
 * In your html add
 * <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
 * <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder"></script>
 */

  const loadData = async () => {    
    const res = await fetch("https://griffa.dev/feed/feed.json");
    const feed = (await res.json());
    const data = feed.items.map((item) => {
      return {
        searchData: `${item.title} ${item.summary}`,
        title: item.title,
        description: item.summary,
        link: item.url
      }
    });
    console.log("data loaded");
    return data;
  };
  let model;
  let data;
  const loadModel = async () => {
    const model = await use.load();
    console.log("model loaded");
    return model;
  };
  try {
  [model, data] = await Promise.all([
        loadModel(),
        loadData()
  ])
  } catch(e) {
    console.error(e);
  }
```