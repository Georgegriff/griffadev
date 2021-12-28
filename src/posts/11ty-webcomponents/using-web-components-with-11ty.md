---
title: "Using Web Components With 11ty"
description: I took a progressive enhancement approach to using frontend javascript for my blog, Web Components are the perfect fit here.
series:
  title: Building a personal blog
  order: 4
date: "2021-12-28"
tags:
  - 11ty
  - WebComponents
  - JavaScript
---

I've talked about earlier in this series that I wanted to bring things back to basics with this blog, focusing on web fundamentals e.g. html and css. In addition to this, by using 11ty, I'm able to author in Markdown, meaning I'm free to add HTML anywhere in my posts.

However, whist I'm focusing on HTML/CSS, there are areas where it makes sense to sprinkle in JavaScript, for extra interactivity, this is where Web Components come in.

![Picture of my fighting cats Chewie and Beau](/images/fighting-cats.gif "Hey! He mentioned web components, get him! (Chewie and Beau are friends really)")

A Google engineer said it better than I could:

{% twitter "1212847104718061569" %}

In this article I'll explain how I went about setting up a development environment for Web Components, as well as simple production optimizations.

But first, I want to discuss the approach that I've taken for consuming web components in this site. All content should be available without JavaScript/Web Components available, but where they are available, the content should be progressively enhanced.

## Progressive enhancement web component use cases

Here are a couple of uses cases I had for progressively enhanced content, using JavaScript.

### YouTube embed

To embed a YouTube video via progressive enhancement, you first need to identify what is the minimal HTML-only implementation of the content, this is:

- A link which when clicked navigates to the video.
- An image thumbnail to be used for the link to wrap.
- A caption for the video, important for accessibility.

The second part of this is identifying a component to use to embed the YouTube player, I wasn't going to re-invent the wheel here.

[lite-youtube-embed](https://www.npmjs.com/package/lite-youtube-embed) from [Paul Irish](https://twitter.com/paul_irish), is the perfect fit here.

`npm install lite-youtube-embed`

```html
<lite-youtube
  class="video"
  videoid="j8mJrhhdHWc"
  style="background-image: url('https://i.ytimg.com/vi/j8mJrhhdHWc/hqdefault.jpg');"
>
  <a
    onclick="('customElements' in window) && event.preventDefault()"
    title="Play Video"
    class="no-js"
    target="_blank"
    href="https://youtube.com?w=j8mJrhhdHWc"
    >{% include "img/play.svg" %}</a
  >
</lite-youtube>
```

There's a couple of things going on above:

- background-image server from youtube CDN.
- There is an `<a>` by default, this will open the youtube video in a new tab
- onclick to prevent opening a new tab.

Explaining the onclick: Whats happening here is.

- If Web Components/JavaScript are not available on the site, the onclick is ignored, and links as expected, I do this by checking if `customElements` is supported in the browser.
- When JS/Web Components are enabled and the link is clicked, the tab does not open, and the click is instead handled by `lite-youtube`, resulting in a youtube embed.

Like so:

{% youtube "j8mJrhhdHWc" %}

### Live code demos

At some point I will have to do a post that goes into more detail of exactly how my live demos are authored using Markdown in 11ty, but they are ultimately rendered using a web component.

Let's get meta, here is a Live demo web component that renders itself.

```html live-demo-demo

  <live-demo id="my-live-demo">
    <div slot="html">
        &lt;div class=&quot;my-div&quot;&gt;styled by the css&lt;/div&gt;
    </div>
      <div slot="css">
        .my-div {
          color: var(--Primary, blue);
        }
    </div>
</div>
```

```css live-demo-demo
live-demo {
  width: 400px;
  height: 300px;
  margin: 3rem;
  min-height: auto;
  display: flex;
}
```

The approach I've taken here is that when the web component is not available, the code is just rendered and syntax highlighted, but when JS is available a live demo component appears. If you were to disable JavaScript in your browser you should just see the code snippets instead.

I made use of slots, one for `js` one for `html` and one for `css`. The web component then takes the text content and renders it appropriately.

This approach is `a lot` like [https://open-wc.org/mdjs/](mdjs), which I hope to use in the future for my blog, but it was fun to see about how I could build this myself.

## Setting up a dev environment for 11ty and Web Components

Setting up a development environment for 11ty and web components is pretty simple, especially if are using pure JavaScript, and don't need any build process. I found that having no build process was such a breath of fresh air, development tools should just get out of your way and let you code.

> If you are just working with vanilla web components and don't want to use any dependencies from NPM, then good news, you don't need to do anything special, just use the default 11ty dev server, and move on to create great content!

If you want to use some components or libraries from NPM e.g. lit-html/lit-element you will need a way to transform `bare imports` into relative urls that work in the browser, e.g.

```js
import { LitElement } from "lit";
```

would become something like:

```js
import { LitElement } from "./../node_modules/lit-element/lit-element.js";
```

The best tool for doing this is [https://www.npmjs.com/package/es-dev-server](https://www.npmjs.com/package/es-dev-server).

> At the time of writing this tool is in the process of getting moved over to [@web/dev-server](https://www.npmjs.com/package/@web/dev-server). For this example, i'll use `@web/dev-server` but `es-dev-server` would work too.

```js
npm i --save-dev @web/dev-server
```

First off, when serving an 11ty website you would normally use `npx eleventy --serve`, however instead we're going to use `npx eleventy --watch`.
This will give us all the live building of your 11ty site, but without a server.

For our server, this is where `@web/dev-server` will come in, which can be run like so:

```js
web-dev-server --node-resolve --open
```

In order to combine these two tasks we can use `concurrently`

```js
npm i concurrently --save-dev
```

and combine them into a npm script:

```js
    "start": "concurrently \"npx eleventy --watch\" \"web-dev-server  --node-resolve\"",
```

Combining the above will give us a dev server, however we have not told it how find our 11ty `_site` folder, as well as resolving our node modules.
In order to do this we will need to introduce a small config file and implement a simple middleware to do the following:

- If the request is an 11ty asset serve it from `_site` by appending `_site` to url.
- If the request is for a html page serve it from `_site`
- Otherwise move to `next()` which will allow JS files to be handled by logic to resolve ESM imports.

Create a file call `web-dev-server.config.js`

```js
module.exports = {
  port: 8000,
  watch: true,
  rootDir: ".",
  middleware: [serve11tyAssets({ dist: "_site_" })],
  nodeResolve: true,
};
```

This should all be quite straight forward to understand hopefully:

- port: Local port for the server
- watch: Makes browser reload whenever something changes
- rootDir: This should be the root dir that contains `node_modules` and the 11ty `_site` folder.
- middleware: functions that get executed on requests, i'll explain serve11tyAssets shortly.
- nodeResolve: flag to convert `import foo from 'bar'`

`serve11tyAssets` will look something like this.

```js
const path = require("path");
const fs = require("fs").promises;
const URL = require("url").URL;
/**
 *
 * Check if asset lives in 11ty _site folder, if not serve from root folder.
 */
const serve11tyAssets = ({ dist = "_site" } = {}) => {
  return async (context, next) => {
    // Node URL requires a full url so... whatever.com (url isnot important)
    const pathName = new URL(`https://whatever.com${context.url}`).pathname;
    // is the request for a html file?
    const url = pathName.endsWith("/") ? `${pathName}index.html` : pathName;
    try {
      // check if the file exists, if so, modify the url to come from `_site` folder.
      const stats = await fs.stat(path.join(dist, url));
      if (stats.isFile()) {
        context.url = `/${dist}${pathName}`;
      }
      return next();
    } catch {
      return next();
    }
  };
};
```

Hopefully this example makes sense, and shows how simple it is to add vanilla JavaScript modules into your 11ty development server.
You can easily add new tools into this chain if you need as well e.g. gulp

```js
    "start": "npx gulp && concurrently \"npx gulp watch\" \"npx eleventy --watch\" \"web-dev-server\""
```

## Production optimization of JavaScript

When it comes to choosing tools to optimize your JavaScript for an 11ty project, the choice is entirely up to you, if like me you don't want to configure a complex build, you can leverage the great work of others, by using [Open WC rollup config](https://open-wc.org/building/building-rollup.html).

Here is my config.

```js
npm i rollup deepmerge rollup-plugin-output-manifest @open-wc/building-rollup -D
```

```js
import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import outputManifest from "rollup-plugin-output-manifest";

const entrypoints = {
  index: "src/assets/index.js",
};

const baseConfig = createBasicConfig({
  outputDir: "dist/assets",
});

export default merge(baseConfig, {
  input: entrypoints,
  plugins: [
    outputManifest({
      // ../ to go outside of dist and into include
      fileName: "../../src/_includes/manifest.json",
      // assets is my folder of choice for js files
      publicPath: "assets/",
    }),
  ],
});
```

You can add extra entrypoints, which is helpful, if you only want to load some components on some pages.

In order to hook this back into `11ty` I'm making use of `rollup-plugin-output-manifest`. This outputs a `manifest.json` file.
You could output this as a [data file](https://www.11ty.dev/docs/data-global/) if you wanted to, but I wanted to add a little more logic to my scripts so I could do different things depending on if in `production` mode or not.

Create a file called `src/_data/assets.js`, which will be read as [Global Data File](https://www.11ty.dev/docs/data-global/).

```js
module.exports = {
  getPath: (assetName) => {
    if (process.env.NODE_ENV === "production") {
      const assets = require("../_includes/manifest.json");
      const modulePath = assets[assetName];
      if (!modulePath) {
        throw new Error(
          `error with getAsset, ${assetName} does not exist in manifest.json`
        );
      }
      return `/${modulePath}`;
    } else {
      return `/src/assets/${assetName}`;
    }
  },
};
```

Then in 11ty templates:

{% raw %}

```html
    <script src="{{ assets.getPath("index.js")}}" type="module"></script>
```

{% endraw %}

Doing this allowed me to just serve the unmodified src code when in development, but embed the production assets, which have hashes in their names for cache busting.

If you are wondering how to set the NODE_ENV flag, here is my build script.

```js
    "build": "rm -rf dist && NODE_ENV=production rollup -c rollup.config.js && NODE_ENV=production npx eleventy"
```

And that's my setup, I'm sure there are better ways of doing this but it got the job done for me, hopefully this was useful.
