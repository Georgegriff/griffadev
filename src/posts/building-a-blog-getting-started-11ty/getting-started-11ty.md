---
title: 'How I got started with 11ty'
description: I work with React and painfully slow Webpack builds every day, using 11ty for my blog was a breath of fresh air. By using the 11ty starter projects and awesome courses and tutorials for help, I felt like I had superpowers!
series:
  title: Building a personal blog
  order: 3
date: '2020-10-06'
tags:
  - 11ty
  - JavaScript
---

This article details some of the different resources that I used for learning 11ty to build out my personal website. This is not a tutorial, it is more of a description of the journey that I went on, with the hope some of the steps that I took might help others.

When building [griffa.dev](https://griffa.dev) I wanted to bring things as back to basics as much as I could.

I wanted to write:
- HTML
- CSS
- and vanilla JS/Node JS

I wanted to have:
- As minimal build as possible
- Author in a portable format e.g. HTML/Markdown, so I could post my content to other locations e.g. [dev.to](https://dev.to)
- Little to no frontend JavaScript and frontend build tools (Webpack/Rollup etc)
- Ability to customize site generation in JavaScript, because that is what i'm most comfortable in.

I did not want:
- An inflexible framework
- A server to manage
- To use React, i'm using it all the time at work and i'm sick of it, all it does is introduce layers upon layers of complexity.

With all of the above in mind, I did some research, some of which I went into in [Part 1](https://griffa.dev/posts/good-research-planning-and-design-is-the-best-foundation-for-starting-a-new-project/) of this series, and I came to the conclusion that I wanted to use a static site generator, and the tool that I chose was [Eleventy (11ty)](https://11ty.dev).

![Ginger cat looking he has sad eyes](/images/sad_beau.jpg "Beau is looking sad because I told him i'm not using React, but I didn't want a slow website, so sorry mate.")

> Okay just to get this out of the way, the only thing i dislike about 11ty is, i'm never sure whether to write it as 11ty or Eleventy, and I think the creator is just trolling us because even the twitter account is `@eleven_ty`. Well, "ty" [Zach](https://twitter.com/zachleat), "ty" for Eleventy.

## What is 11ty

To quote its website, "Eleventy is a simpler static site generator", and simple is right, you can start with a single markdown file, and generate a HTML page from that.

```javascript
npm install -g @11ty/eleventy
echo '# Page header' > README.md
eleventy
```

So thats a tick for:
✅ Author in a portable format e.g. HTML/Markdown, so I could post my content to other locations.
✅ As minimal build as possible.

On the build front, obviously things can get more complex, but starting from zero code and zero config is a big win for me, I personally really dislike when you get started on a project and the first advice is to install a few hundred dependencies (see Create React App).

"Eleventy is not a JavaScript framework—that means zero boilerplate client-side JavaScript." 
✅ Little to no frontend JavaScript and frontend build tools (Webpack/Rollup etc)

For customization 11ty has:
- `.eleventy.js` which is a configuration format, which has a plugin architecture with an active ecosystem.
An example plugin is, adding syntax highlighting to code snippets:
```js
// .eleventy.js
module.exports = (eleventyConfig) => {
    const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
};
```
- For other customization you have "data files", allowing you to pull in static or dynamic data into templates.

Here is an example use of data files: https://github.com/Georgegriff/griffadev/blob/main/src/_data/external.js
In this code I am adding my external links and external share data, which will be available in my templates.

I can then use this external data in my templates, it's all pretty easy.

{% raw %}
```html
<nav aria-label="Social Sharing">
  <ul class="social-share">
    {% set genericShareData = external.genericShare.data(title, tags, page) %}
        <li><button class="native-share" style="display: none;" hidden data-title="{{genericShareData.title}}" data-url="{{genericShareData.url}}" data-text="{{genericShareData.text}}" aria-label="Native share">{% include 'img/share.svg' %}</button></li>
    {%- for link in external.sharing %}
        <li><a class="icon-share url-share" title="{{link.text}}" target="_blank" href="{{link.url(title, tags, page) | url}}" class="action external">{% include link.icon %}</a></li>
    {%- endfor %}
  </ul>
</nav>
```
{% endraw %}

If you are thinking doesn't look like HTML to me, you'd be right, these are templating languages,
11ty supports [many of them](https://www.11ty.dev/docs/languages/), {% raw %}\{\% {% endraw %} is Nunjucks and {% raw %}{{}}{% endraw %} is liquid. You can quite happily swap between templating engines in 11ty, using multiple at once.

Also, if you are wondering what `class="native-share" style="display: none;"` is all about in the HTML, this is a progressive enhancement for using the native `navigator.share` browser API. If you are interested in my approach for implementing social sharing, I  plan on writing about this... sometime.


Both config and data files can be NodeJS modules, unlocking the entire JavaScript ecosystem at build time, without passing any cost into users of your site.

✅ Ability to customize site generation in JavaScript, because that is what i'm most comfortable in.

It's fair to say that even with the documentation site starting point, I wasn't feeling very confident in where to start to build out my website. That's not a slight on the docs, the docs are great, I just tend to learn best in tutorial based formats. To YouTube I go!

## Learning 11ty

After a quick "learn 11ty" search in YouTube I came across the following video:

{% youtube "j8mJrhhdHWc" %}

It's a long video, but well worth it, the video format is a really relaxed pair programming session and has the creator of 11ty helping a newbie hack around in 11ty. One of things that I found most impressive with 11ty was that [Jason](https://twitter.com/jlengstorf) was able to just write files and most things just worked.


I was so excited after this video, I felt like i'd been given superpowers!

{% twitter "1292911029865906177" %}

One of the best things about the 11ty ecosystem is its curated collection of [starter projects](https://www.11ty.dev/docs/starter/), these range from simple to very complex, for example by [incorporating performance optimizations](https://github.com/google/eleventy-high-performance-blog).

I know it might seem like i'm contradicting myself a bit from earlier, from when I complained about complex scaffolded projects, but here's how I tackled both learning and scaffolding out my own project.

- I recommend starting out with an empty repository, and copying in what you need from other starter projects. The reason for this is you will be able to learn exactly what is already possible, and what all the code in your project means.
- In order to know what to copy, you obviously a good starting point, I recommend starting out with the official [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) and go through each of the files in turn making sure you understand how they fit in. If you watched the video earlier the pieces should start to fall into place.

Some of the most important concepts to get to grips with are:
- [Layouts](https://www.11ty.dev/docs/layouts/)
- [Collections](https://www.11ty.dev/docs/collections/)
- [Pagination](https://www.11ty.dev/docs/pagination/)
This doesn't just mean next and previous pages, it can mean generating pages from data, pagination is awesome in 11ty.
- [Permalinks](https://www.11ty.dev/docs/permalinks/)
- [Data](https://www.11ty.dev/docs/pages-from-data/)
- [Filters](https://www.11ty.dev/docs/filters/)

## A Next level 11ty course

A few days into this project, some drama happened over in React/Gatsby land on twitter, and as a result I came across this amazing course: [Learn Eleventy From Scratch](https://piccalil.li/course/learn-eleventy-from-scratch) 

This course is seriously awesome, it's also a stealth CSS course. One thing to note is this is a text based course, which i'd never really done before, but I actually really liked because I was able to move at my own pace. I found that doing this course allowed me to really solidify my understanding of 11ty, so that I was able to bring together influences from various project and tutorials, and change them to work for me, to build out my site.

## I got to building

Over the course of a month or two, just using my evenings after my day job and some weekends, through the hell-scape of 2020, I built out [griffa.dev](https://griffa.dev), and had a lot of fun along the way. I won't lie and pretend that everything went smoothly, I get distracted very easily, the first few days working on it went something like this:

{% twitter "1295057860397850625" %}

### Show me the code

The source code for my blog is available here: https://github.com/Georgegriff/griffadev/

[The first commit](https://github.com/Georgegriff/griffadev/commit/11eb02653485ba6c50eefa72cf89c21e3f16b366) where I scaffolded out my project. You'll notice some of the code is from the base starter and some from the awesome course from [Piccalilli](https://piccalil.li/course/learn-eleventy-from-scratch/) I mentioned earlier, and some from just hacking around and finding what works.

In the next part in this series I'll go into some detail on how I added "a little" frontend JavaScript as progressive enhancements only, to keep the site as fast as possible.

