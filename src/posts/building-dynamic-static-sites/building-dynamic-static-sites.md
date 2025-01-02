---
title: Adding dynamic content from an API to a static website at build time
description: You may not need client side JavaScript to add dynamic content from an API. In this article I will show the approach I recently took to embed YouTube playlists into an website created by a static site generator (Elventy), and how this approach lends itself to less JavaScript and progressive enhancement.
tags:
  - 11ty
  - HTML
  - JavaScript
  - WebComponents
date: "2021-06-21"
hero:
  image: /images/cg-guitar-videos.png
  alt: "Embedded YouTube Playlists in the CG Guitar website"
series:
  title: Static sites with dynamic content
  order: 1
---

I recently launched a re-write of my brothers Guitar teaching business website: [cgguitar.co.uk](https://www.cgguitar.co.uk), during this rewrite I had some guiding principles which I believe are best practices when building any website:

- Use the right tool for the job. You don't need a metric-ton of JavaScript for most websites minimum user experiences.
- Provide a great baseline experience with No JavaScript whatsoever.
- Limit the number of calls to external services to keep the page load fast.

In this post I'll describe my approach to getting embedded YouTube playlist content into the website, at build time, reducing the number calls to YouTube client side to only the embedded video and thumbnails, no calls out to the YouTube Data API. In addition to this, i'll show you how you can keep the site up to date with easy to configure cron jobs (scheduled builds).

The feature that I built, that I will explain, is an embedded YouTube playlist component which fetches all the data and stats for YouTube playlists at build time and renders their video metadata/thumbnails directly into the HTML. You can check out the feature live over at [https://www.cgguitar.co.uk/videos/#guitar-lessons](https://www.cgguitar.co.uk/videos/#guitar-lessons).

![Embedded YouTube Playlists in the CG Guitar website](/images/cg-guitar-videos.png "The YouTube Playlists feature I built with this technique.")

## The problem with client side

Calling out to external APIs/services from your client side JavaScript can introduce you many problems, to name a few:

**Security** - if you want to hide your token or keep it secure you either have to:

- Ensure your token only works on your websites domain, but this doesn't stop people using it from outside of a web browser.
- Add some complex proxy set up where you hide the token on a server you manage, requires having a server or proxy configuration.

**Rate limiting/charges** - most APIs have limits to the number of API calls you can make, or will start charging you for usage:

- Your website content doesn't scale, each visitor would be using your token to call the external services for every visit.
- You could end up incurring accidental charges!

**JavaScript needed** - In order to show the data you want to show to user, you need to serve JavaScript to your users:

- Depending on Network speed or the amount of JavaScript on the page the user has to wait for the JS to download before seeing any content.
- A user may choose to disable JavaScript.
- JavaScript may fail to load entirely, rendering a useless experience to users.

## Moving your calls to external APIs to build time

This is approach is not a silver bullet, not every feature would support this, e.g. if you want to work with user submitted content.
However, if all you are showing is content that changes infrequently, moving the data fetching to build time can be a really great solution.

The static site I built for my brothers' business uses [Eleventy](https://11ty.dev), a fantastic static site generator.
I wrote about getting started with 11ty in [How I got started with 11ty](https://griffa.dev/posts/how-i-got-started-with-11ty/).

The next section will assume some knowledge about 11ty, or static site generators in general.

11ty has a plugin called [@11ty/eleventy-cache-assets](https://www.11ty.dev/docs/plugins/cache/) which you can use to fetch any data you like.

```js
const Cache = require("@11ty/eleventy-cache-assets");

module.exports = async function () {
  let url = "https://api.github.com/repos/11ty/eleventy";

  /* This returns a promise */
  return Cache(url, {
    duration: "1d", // save for 1 day
    type: "json", // we’ll parse JSON for you
  });
};
```

The awesome thing about this plugin is that once the data is fetched it is cached so future local builds do not have to re-fetch data, meaning your builds can remain lightning fast which is a common characteristic of any 11ty project.

## Embedding YouTube playlists at build time

For my feature I decided I wanted to be able to pick and choose which YouTube playlists that I wanted to show in the website, it is however possible to fetch all YouTube playlists for an account too. I wanted to be able to choose so that I could add, order and describe new playlists in my CMS (Netlify CMS).

The playlists in the website are defined as markdown in the code in a folder named [playlists](https://github.com/Georgegriff/cgguitar-site/tree/main/src/playlists), Netlify CMS is configured to [read these files](https://github.com/Georgegriff/cgguitar-site/blob/178a8ae66a4b22f4566dfe579b748369abf0f297/admin/config.yml#L649) e.g:

```md
---
title: Beginner guitar lessons
name: beginner-guitar-lessons
id: PLA0cAQ-2uoeoJoFfUz9oq9qhmlnsjFRhU
---
```

![Netlify CMS showing defined playlists](/images/netlify-cms-videos.png "Each of these entries contains a name, id and description.")

The first step to getting my playlists into 11ty is to define them as a collection, to do this inside of the `src/playlists` folder I create a [playlists.json](https://github.com/Georgegriff/cgguitar-site/blob/main/src/playlists/playlists.json).

```js
{
    "tags": ["playlist"],
    "permalink": false
}
```

This creates an 11ty collection of all of the playlists, with their "id", "name" and "descriptions".

Inside of my videos page I can then work with this collection in my Nunjucks template:
{%- raw -%}

```html
{%- if collections.playlists %} {%- asyncEach collections.playlist in playlists
| fetchYouTubePlaylists %} {%- include 'partials/video-playlist.njk' %} {%-
endeach %} {%- endif %}
```

{%- endraw -%}

> If you are unfamiliar with template languages in 11ty you can read about them over [here](https://www.11ty.dev/docs/templates/).

I'll show what `partials/video-playlist.njk` is later on in the article.

`fetchYouTubePlaylists` is where the magic happens and where we will start to use `@11ty/eleventy-cache-assets`.
This is an 11ty filter which is defined in my `.eleventy.js` config file.

```js
eleventyConfig.addNunjucksAsyncFilter(
  "fetchYouTubePlaylists",
  async (playlists, callback) => {
    const data = await getPlaylists(playlists);
    callback(null, data);
  }
);
```

Let's take a dive a layer deeper: `getPlaylists` is making a call to `getPlaylistItem` which is where I'm actually doing the data caching.

```js
module.exports.getPlaylists = async (playlists) => {
  if (!playlists) {
    return [];
  }
  const lists = await Promise.all(
    playlists.map(async ({ id, title, description }) => {
      const content = await getPlaylistItem(id);
      return {
        title,
        id,
        description,
        link: `https://www.youtube.com/playlist?list=${id}`,
        ...(content || {}),
      };
    })
  );
  return lists;
};
```

This function is looping through all of my playlists and fetching the items (videos) in that playlist. It is also adding the name, description and direct link to YouTube for the whole playlist.

Now for `getPlaylistItem`:

```js
const getPlaylistItem = async (playlistId) => {
  const apiUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
  const maxResults = 20;
  const order = "viewCount";
  const url = `${apiUrl}?key=${apiKey}&part=${encodeURIComponent(
    "snippet,contentDetails"
  )}&type=video%2C%20playlist&maxResults=${maxResults}&playlistId=${playlistId}&order=${order}`;

  console.log(`Fetching YouTube videos for playlist: ${playlistId}`);
  const videos = await Cache(url, {
    duration: "1d", // 1 day
    type: "json", // also supports "text" or "buffer"
  });

  const videoIds = videos.items.map(
    ({ contentDetails }) => contentDetails.videoId
  );
  const metaInfo = await fetchMetaInfo(videoIds);
  return {
    videos: await Promise.all(
      videos.items.map(async ({ snippet, contentDetails }) => {
        const hqThumbnail =
          snippet.thumbnails.maxres ||
          snippet.thumbnails.high ||
          snippet.thumbnails.medium ||
          snippet.thumbnails.default;
        const smallThumbnail =
          snippet.thumbnails.medium || snippet.thumbnails.default;
        const defaultThumbnail = snippet.thumbnails.high;

        return {
          hqThumbnail,
          smallThumbnail,
          defaultThumbnail,
          channelTitle: snippet.channelTitle,
          channelId: snippet.channelId,
          title: snippet.title,
          id: contentDetails.videoId,
          ...(metaInfo[contentDetails.videoId] || {}),
        };
      })
    ),
    hasMore: Boolean(videos.nextPageToken),
  };
};
```

The first few things this function does is:

- Set base url for YouTube API: https://www.googleapis.com/youtube/v3/playlistItems
- Set the max number of items in a playlist to return on a page
- Pass in APIKey and build up url in accordance with the [API Docs](https://developers.google.com/youtube/v3/docs/playlistItems/list).

> You will want to store your API key as an environment variable e.g. `const apiKey = process.env.YT_API_KEY;`. For production you can add this environment variable where ever you choose to build/host the site e.g. on Netlify.

Next up it fetches some extra metadata. `fetchMetaInfo` fetches things like view count and likes, this is another API call which we would be concerned about if this was client side, but since it's build time, who cares!
Implementation available on [Github](https://github.com/Georgegriff/cgguitar-site/blob/178a8ae66a4b22f4566dfe579b748369abf0f297/src/_filters/youtube.js#L57).

Finally I'm looping through all the data and returning an array of `videos` for each playlist and a flag `hasMore` if the playlist has more than then 20 items shown. In my HTML when I see this flag I add an link out to YouTube to watch the full playlist.

The above code a modified version of the original, where I'm doing a a few extra things you can checkout the full version on [Github](https://github.com/Georgegriff/cgguitar-site/blob/178a8ae66a4b22f4566dfe579b748369abf0f297/src/_filters/youtube.js#L6).

## Progressive Enhancement

Now I have the website fetching the external data, let's see how I could approach displaying the content in the HTML.

When designing an dynamic experience its a good idea to think about what is the minimal experience you can provide without needing JavaScript, and build from there.
You could start out very simply and just load a link `<a>` to the YouTube videos, perhaps the thumbnail could open a tab to YouTube, this needs no JS at all, and is what I did:

{%- raw %}

```html
{%- if playlist -%}
 {%- set firstVideo = playlist.videos[0] -%}
 {%- set description = playlist.description or (playlist.templateContent | safe) %}
   <youtube-playlist id="{{playlist.title | slug }}">
         <div class="fallback" slot="fallback">
            <div class="img-btn-wrapper">
                <img decoding="async" loading="lazy" width="{{firstVideo.hqThumbnailWidth}}" height="{{firstVideo.hqThumbnaillWdith}}" src="{{firstVideo.hqThumbnailUrl}}" />
            </div>
            <a rel="noopener" title="Play playlist: {{playlist.title}}" class="" target="_blank" href="{{playlist.link}}"></a>
        </div>
        {%- for video in playlist.videos -%}
            <li {{helpers.spread(video, "data-") | safe}}></li>
        {%- endfor -%}
        {%- if playlist.hasMore -%}
        <a slot="more-link" href="{{playlist.link}}">Watch more on YouTube.</a>
        {%- endif -%}
   </youtube-playlist>
{%- endif -%}
```

{%- endraw -%}

You will see that I'm wrapping the whole code in a `youtube-playlist` Custom Element.
When the component loads without JavaScript it is just a link out to YouTube, which is then upgraded to a full playlist experience. This will disable the default "link" behavior too.

I'm not going to go into the implementation of my Web Component in this post but you can check out the source code on [Github](https://github.com/Georgegriff/cgguitar-site/blob/178a8ae66a4b22f4566dfe579b748369abf0f297/src/scripts/components/youtube-playlist/YoutubePlaylist.js). The general idea is to consume `<li>` list items as child content inside of my `<youtube-playlist>` and when JavaScript loads move this content in the Shadow DOM, and make them look pretty/interactive.

Here is my full Nunjucks template for my html:

{%- raw -%}

```html
{%- if playlist -%}
 {%- set firstVideo = playlist.videos[0] -%}
 {%- set description = playlist.description or (playlist.templateContent | safe) %}
   <youtube-playlist id="{{playlist.title | slug }}">
        <a slot="heading" href="#{{playlist.title | slug }}"><h2>{{playlist.title | safe}}</h2></a>
        <p slot="description">{{description}}</p>
         <div class="fallback" slot="fallback">
            <div class="img-btn-wrapper">
                <img decoding="async" loading="lazy" width="{{firstVideo.hqThumbnailWidth}}" height="{{firstVideo.hqThumbnaillWdith}}" src="{{firstVideo.hqThumbnailUrl}}" />
                <svg style="pointer-events:none;" class="playbtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                        <g transform="translate(-339 -150.484)">
                            <path fill="var(--White, #fff)" d="M-1978.639,24.261h0a1.555,1.555,0,0,1-1.555-1.551V9.291a1.555,1.555,0,0,1,1.555-1.551,1.527,1.527,0,0,1,.748.2l11.355,6.9a1.538,1.538,0,0,1,.793,1.362,1.526,1.526,0,0,1-.793,1.348l-11.355,6.516A1.52,1.52,0,0,1-1978.639,24.261Z" transform="translate(2329 150.484)"/>
                            <path fill="var(--Primary, #000)" d="M16.563.563a16,16,0,1,0,16,16A16,16,0,0,0,16.563.563Zm7.465,17.548L12.672,24.627a1.551,1.551,0,0,1-2.3-1.355V9.853a1.552,1.552,0,0,1,2.3-1.355l11.355,6.9A1.553,1.553,0,0,1,24.027,18.111Z" transform="translate(338.438 149.922)" />
                        </g>
                </svg>
            </div>
            <a rel="noopener" title="Play playlist: {{playlist.title}}" class="" target="_blank" href="{{playlist.link}}"></a>
        </div>
        {%- for video in playlist.videos -%}
            <li {{helpers.spread(video, "data-") | safe}}></li>
        {%- endfor -%}
        {%- if playlist.hasMore -%}
        <a slot="more-link" href="{{playlist.link}}">Watch more on YouTube.</a>
        {%- endif -%}
   </youtube-playlist>
{%- endif -%}
```

{%- endraw -%}

Using Web Components like this is a perfect way of enhancing a base HTML experience with limited JavaScript.

## Periodically building your website

In order to keep the YouTube playlists up to date I want to be able to build the website every day on schedule.

There are many options when it comes to periodically building a website, I wrote about my approach to doing this in: [Scheduling builds on Netlify](https://griffa.dev/posts/scheduling-builds-on-netlify/). In brief, I opted to use Circle CI to call my Netlify build hook every day at 3 PM. I tried Github Actions but there is a major limitation to using an Action for this use case, which I go into in the linked article.

## Summary

I hope this article was helpful and you can see some of the advantages to moving dynamic content that changes infrequently to be rendered at build time.

If you want to read more of my work, please follow me on X [@griffadev](https://twitter.com/griffadev), or get me a [coffee](https://ko-fi.com/griffadev) if you feel like it ☕.
