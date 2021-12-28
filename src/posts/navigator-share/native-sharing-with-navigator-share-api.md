---
title: "Using the Web Share API and meta tags, for simple native sharing"
description: Adding share links for all the various places users can share content from Twitter, to LinkedIn or Reddit and many more, can be a real pain. The Web Share API is growing in support, making sharing content on the web easier than ever. For browsers that don't support the API you can fall back to self generated share targets.
date: "2020-10-10"
hero:
  image: "/images/nav-share.png"
  alt: "Showing use the Web Share API"
tags:
  - JavaScript
  - 11ty
  - Webdev
---

Supporting all of various places that content can be shared on a web site is tricky, all sites have their own mechanisms for doing it, and you can never support all of the places that a user may want to share content.

Thats where the Web Share API comes in, with it, sharing content on the Web is much more straight forward, using this API also gives your users the freedom to share content wherever they like, from chat apps and social media to a notes app.

At the end of the article I go into the all important html meta tags, to make sure that sites/apps can pick up nice previews for your content.

```js
if(navigator.share) {
    navigator.share({
            text:"Some text to share",
            title: "Title of what you are sharing",
            url: "url to share"
        }).then(() => {
            // do something on success
        }).catch(() =>  {
            // handle errors
        });
    })
}
```

And your user will end up with a "share sheet", where they can decide where they want to share.

![Phone screen showing share action UI](/images/share-action.jpg "No more having to decide where you think your users will want to share content")

## Browser support

At this point you're probably thinking yeah, this is great and all but the browser support is terrible, but I think you might be surprised, the browser support is good in the place it matters most: _mobile_.

![Screenshot of caniuse.com data for the Web Share API](/images/web-share-cani.png "Things aren't as bleak as all the red would indicate")

Yeah that is a lot of red, but if you analyze the data, the support is decent in key places:

- Safari 14 on IOS AND Safari on Mac OS.
- Chrome for Android
- Firefox for Android
- Edge (Windows only)
- Samsung Internet

We're at around 55% of global users, however if you filter to just mobile you're looking at 91.96% according to [caniuse.com](https://caniuse.com/?search=web%20share%20api). Sure, the obvious missing pieces are cross platform support for Chrome and Firefox, as well as key OSs to capture non Western demographics, but you can always fallback to the older methods of sharing on browsers that don't support the API, and thats what i'll go into next.

## Web Share API as progressive enhancement

The rest of this article describes the approach that I took for implementing the Web Share API as a progressive enhancement to my blog. For browsers where the API is supported the option is offered, otherwise I added share buttons for common places where I might expect people to share e.g. Twitter.

For my blog I'm using 11ty, a really flexible static site generator which encourages you to build lightweight and fast websites.
I wrote about my journey with 11ty over here: [How I got started with 11ty](https://griffa.dev/posts/how-i-got-started-with-11ty/).

### Doing things the old way

Supporting lots of different websites for share targets is quite time consuming, each does it in different ways.

I started out with a bit of html templating:

{% raw %}

```html
<nav class="sharing" aria-label="Social Sharing">
  <ul class="social-share">
    {%- for link in external.sharing %}
    <li>
      <a
        class="icon-share url-share"
        title="{{link.text}}"
        target="_blank"
        href="{{link.url(title, tags, page) | url}}"
        class="action external"
      >
        {% include link.icon %}
      </a>
    </li>
    {%- endfor %}
  </ul>
</nav>
```

{% endraw %}

I'm making use of a few things here in 11ty, [Nunjucks templating](https://mozilla.github.io/nunjucks/templating.html) and [global data](https://www.11ty.dev/docs/data-global/).

Global data files are either JSON or javascript, you can see from the code snippet that i have a `sharing` array of objects and each object has the following:

- text
- icon
- url function: passing in the page title, tags for my blog post and the current 11ty page object.

Let's take a look at how this is implemented; I have the following file `src/_data/external.js`, this is where the code earlier gets `external` from as its variable name.

The file looks like this.

```js
module.exports = {
  sharing: [
    {
      icon: "img/twitter.svg",
      text: "Share to Twitter",
      url(title, tags = [], page) {
        const twitterUrl = "https://twitter.com/intent/tweet?text=";
        const { text, url } = genericShare.data(title, tags, page);
        return `${twitterUrl}${encodeURIComponent(`${text} ${url}`)}`;
      },
    },
    {
      icon: "img/linkedin.svg",
      text: "Share to LinkedIn",
      url(title, tags = [], page) {
        return `https://www.linkedin.com/shareArticle?mini=true&url=${getUrl(
          page
        )}&title=${encodeURIComponent(title)}&source=griffadev`;
      },
    },
    {
      icon: "img/reddit.svg",
      text: "Share to Reddit",
      url(title, tags = [], page) {
        const baseUrl = "https://www.reddit.com/submit?";
        return `${baseUrl}uri=${getUrl(page)}&title=${encodeURIComponent(
          title
        )}`;
      },
    },
    {
      icon: "img/awful.svg",
      text: "Share to Hacker News",
      url(title, tags = [], page) {
        const baseUrl = "https://news.ycombinator.com/submitlink?";
        return `${baseUrl}u=${getUrl(page)}&t=${encodeURIComponent(title)}`;
      },
    },
  ],
};
```

Hopefully, you can see how the html maps over to the javascript. Each of the websites share the content in slightly different ways.
You might be noticing `genericShare.data` is missing, you'd be right.

Let's take a look at that function:

```js
const siteMeta = require("./metadata.json");
const helpers = require("./helpers");
const getUrl = (page) => encodeURIComponent(`${siteMeta.url}${page.url}`);

const genericShare = {
  data(title, tags = [], page) {
    const url = `${siteMeta.url}${page.url}`;
    const text = `${title} ${
      // get my twitter handle
      siteMeta.author.twitter
    } ${tags
      // remove 11t built in tags from the tags for my bpost
      .filter(helpers.filterCollectionTags)
      // add a twitter style hashtag
      .map((tag) => `#${tag}`)
      // convert back to a string
      .join(" ")}`;
    return {
      text,
      title,
      url,
    };
  },
};
```

In this function I'm getting the full url for my website `siteMeta.url` from a `metadata.json` and appending that to the current `page.url`.
Also in my [metadata.json](https://github.com/Georgegriff/griffadev/blob/main/src/_data/metadata.json) I have some more data about myself e.g. my twitter handle, when people share my posts I can get automatically tagged.

Finally, I added all of the tags from my front matter, that are on the blog post, over to the text for the share content too, I filter out tags that I don't want, for example tags for my 11ty collection names.

If you aren't sure what i mean by [front matter](https://www.11ty.dev/docs/data-frontmatter/) it's the metadata at the top of my markdown files:

{% raw %}

```yaml
---
title: "Using the Web Share API for simple native sharing"
tags:
  - JavaScript
  - 11ty
  - Webdev
---
```

{% endraw %}

For a full implementation reference, checkout my Github repo for my blog:

- [share-page.html](https://github.com/Georgegriff/griffadev/blob/main/src/_includes/partials/share-page.html)
- [src/\_data/external.js](https://github.com/Georgegriff/griffadev/blob/main/src/_data/external.js)
- [metadata.json](https://github.com/Georgegriff/griffadev/blob/main/src/_data/metadata.json)
- [tag filters](https://github.com/Georgegriff/griffadev/blob/e650469e09363ad5049d657c5ea50c6f0225e7ac/src/_data/helpers.js#L5)

### Adding in the Web Share API

Now we've implemented the basic behavior for everyone, we can progressively enhance the website for browsers that support the Web Share API.

Updating the HTML template:

{% raw %}

```html
<nav class="sharing" aria-label="Social Sharing">
  <ul class="social-share">
    {% set genericShareData = external.genericShare.data(title, tags, page) %}
    <li class="native-share" style="display: none;" hidden>
      <button
        data-title="{{genericShareData.title}}"
        data-url="{{genericShareData.url}}"
        data-text="{{genericShareData.text}}"
        aria-label="Native share"
      >
        {% include 'img/share.svg' %}
      </button>
    </li>
    {%- for link in external.sharing %}
    <li>
      <a
        class="icon-share url-share"
        title="{{link.text}}"
        target="_blank"
        href="{{link.url(title, tags, page) | url}}"
        class="action external"
      >
        {% include link.icon %}
      </a>
    </li>
    {%- endfor %}
  </ul>
</nav>
```

{% endraw %}

The key thing that has changed from the original example is the addition of:

{% raw %}

```html
{% set genericShareData = external.genericShare.data(title, tags, page) %}
<li class="native-share" style="display: none;" hidden>
  <button
    data-title="{{genericShareData.title}}"
    data-url="{{genericShareData.url}}"
    data-text="{{genericShareData.text}}"
    aria-label="Native share"
  >
    {% include 'img/share.svg' %}
  </button>
</li>
```

{% endraw %}

You'll see that similar to the example above I'm passing `title`, `url` and `text` using `data-*` attributes,
and executing a function my global data object `external.genericShare.data(title, tags, page)`.

By default this content is hidden with `display:none`, we're going to enable the content with a little bit of JavaScript.

```js
if (navigator.share) {
  const nativeShare = document.querySelector(".native-share");
  if (nativeShare) {
    // make the button visible
    nativeShare.style.display = "flex";
    nativeShare.querySelector("button").addEventListener("click", (e) => {
      const button = e.currentTarget;
      navigator
        .share({
          // grab the data attributes from the html
          text: button.getAttribute("data-text"),
          title: button.getAttribute("data-title"),
          url: button.getAttribute("data-url"),
        })
        .then(() => {
          // show some content to say it was shared, e.g. thank the user.
          nativeShare.classList.add("shared");
        })
        .catch(() => {});
    });
  }
}
```

First, I'm checking that we have access to `navigator.share`. If its available, the button is made visible, a `click` handler is added and on click the `data-*` attributes are read, finally `navigator.share` is called.

If you wanted to, you could hide your fallback links when `navigator.share` is available, I chose not to just yet, but might do down the road, when more desktop site get support for the Web Share API.

If you're wondering how to go about adding JavaScript into an 11ty project, there are many ways to go about it, I recently wrote about how to approach this [for Web Components](https://griffa.dev/posts/using-web-components-with-11ty/).

## Meta tags

To round all of this work out you will want to make sure that you have all of the appropriate meta tags set on your website so that sites can put the correct images/description in share link previews.

For example:

{% raw %}

```html
<meta name="author" content="{{author or metadata.author.name}}" />
<meta property="og:site_name" content="{{ siteTitle }}" />
<meta property="og:title" content="{{ pageTitle }}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{{ currentUrl }}" />

{% if socialImage %}
<meta name="twitter:card" content="summary_large_image" />
<meta property="og:image" content="{{ socialImage }}" />
<meta name="twitter:image" content="{{ socialImage }}" />
<meta property="og:image:alt" content="Page image for {{ metadata.title }}" />
<meta name="twitter:image:alt" content="Page image for {{ metadata.title }}" />
{% endif %} {% if tagline %}
<meta name="description" content="{{ tagline }}" />
<meta name="twitter:description" content="{{ tagline }}" />
<meta property="og:description" content="{{ tagline }}" />
{% endif %}
```

{% endraw %}

You can see my full metadata over on [Github](https://github.com/Georgegriff/griffadev/blob/main/src/_includes/partials/meta.html).

## Summary

Support for the Web Share API is growing and with it progressive enhancement is a really great approach to building modern websites, I wrote about using this approach for fast sites, with interactivity sprinkled in: [Using Web Components With 11ty](https://griffa.dev/posts/using-web-components-with-11ty/).
