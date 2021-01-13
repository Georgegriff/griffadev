---
title: 'Building a responsive, progressively enhanced, masonry layout with only CSS and HTML'
description: Masonry layouts, think bricks, think Pinterest, have had many solutions in the web over the years. Many use too much JavaScript, but there is some exciting new things coming to CSS grid to enable Masonry layouts. But you don't have to wait, you could implement today, using progressive enhancement. Progressive enhancement is like technical debt that fixes itself.
date: '2021-01-13'
hero:
  image: "/images/masonry.png"
  alt: 'Image of a masonry layout'
tags:
  - HTML
  - CSS
---
A few days ago I found that I had talked myself into re-designing a website. The website is for my brothers' [guitar teaching business](https://cgguitar.co.uk/) which I had previously worked a few years ago, when I was a student.  (if you click that link and view it before the rework, yeah I know the site needs work, that's what i'm doing here).

As part of the redesign I was trying to think of ways to lay out testimonials from students, which may have varying length/content, I stumbled onto the idea of using a masonry layout (think bricks, think Pinterest).

![Mock masonry design testimonials that inspired this tutorial](/images/masonry.png)

There are many ways to go about building out a Masonry layout, this CSS tricks article lays out a few of the options, [Approaches for a CSS Masonry Layout](https://css-tricks.com/piecing-together-approaches-for-a-css-masonry-layout/).

When looking into the solution I knew I wanted to adhere to a couple of rules:
- No committing the huge sin of using JavaScript for layout.
- It's okay if the experience upgrades or downgrades based on browser support.

### What are we building

- Masonry layout using `grid-template-rows: masonry`
- CSS Columns as a fallback

This article will explain how to build out the following responsive masonry cards layout with only HTML and CSS.
This final demo uses some features only available in Firefox, behind a flag, which is detailed in the article.

Here is the full finished demo code:

```html demo
    <div class="masonry">
        <div class="brick"><span class="num">1</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">2</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">3</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">4</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">5</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">6</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
         <div class="brick"><span class="num">7</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">8</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">9</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">10</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">11</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">12</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
        <div class="brick"><span class="num">13</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">14</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">15</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">16</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>
        <div class="brick"><span class="num">17</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">18</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">19</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">20</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>
    </div>
```

```css demo
.masonry {
    --masonry-gap: 1rem;
    --masonry-brick-width: 180px;
    column-gap: var(--masonry-gap);
    column-fill: initial;
    column-width: var(--masonry-brick-width);
}

.masonry > * {
    break-inside: avoid;
    margin-bottom: var(--masonry-gap);
}

@supports(grid-template-rows: masonry) {
    .masonry {
      display: grid;
      gap: var(--masonry-gap);
      grid-template-rows: masonry;
      grid-template-columns: repeat(auto-fill, minmax(var(--masonry-brick-width), 1fr));
      align-tracks: stretch;
    }

    .masonry > * {
        margin-bottom: initial;
    }
}

/* some styling not important */
.masonry {
    background: #f3f3f3;
    padding: 2rem;
}
.brick:nth-child(4n - 7) {
    background: #5A363A;
}

.brick:nth-child(4n - 6) {
    background: #82212C;
}

.brick:nth-child(4n - 5) {
    background: #3A3E41;
}

.brick:nth-child(4n - 4) {
    background: #292A2B;
}
.brick {
    color: white;
    padding:1rem;
}
```

### You'd think CSS Grid could do it

CSS Grid is amazing, and you'd think it would have shipped with a simple way of doing masonry layouts, the initial versions of the spec however, did not ship anything to really help out with these layouts.

But fear not, Firefox has something cooking! 

> Before I continue, the specification we're going to look into is experimental, and at the time of writing only is available in Firefox behind a flag, however, this article will outline how you could use the feature today and fallback to another approach for browsers without support.

### Enabling Masonry layout in Firefox

It's January 2021, i'm using Firefox 84.0.2, depending on how the spec has progressed, you may not need to enable this flag, it may even be available in other browsers, [this link may have more information](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout).

To enable in Firefox:
1. type `about:config` into your address bar
2. Accept the warnings
3. In the search box find: `layout.css.grid-template-masonry-value.enabled` and enable it.

Over on MDN you can find this article: [CSS Grid Layout > Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout)

It details, an example very similar to this:

```css basic-example
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  /* this only works in firefox right now */
  grid-template-rows: masonry;
  margin:1rem;
}
.item {
    background: var(--Primary, #74baff);
}
```

```html basic-example
<div class="grid">
  <div class="item" style="block-size: 2em;"></div>
  <div class="item" style="block-size: 3em;"></div>
  <div class="item" style="block-size: 1.6em;"></div>
  <div class="item" style="block-size: 4em;"></div>
  <div class="item" style="block-size: 2.2em;"></div>
  <div class="item" style="block-size: 3em;"></div>
  <div class="item" style="block-size: 4.5em;"></div>
  <div class="item" style="block-size: 1em;"></div>
  <div class="item" style="block-size: 3.5em;"></div>
  <div class="item" style="block-size: 2.8em;"></div>
</div>
```
With this small amount of CSS we can get a layout which is almost what we want already, exciting! It has hardcoded sizing, lets improve it, and enable responsive masonry layouts,

## Building out our example

Let's start with a fresh example, starting with a little html and "lorem ipsum" to generate some "bricks" for masonry layout.

To see the effect you will need to be view these examples in a browser that supports masonry layouts (at the time of writing Firefox behind a flag).

```html masonry-wonky-bottom
    <div class="masonry">
        <div class="brick"><span class="num">1</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">2</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">3</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">4</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">5</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">6</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
        <div class="brick"><span class="num">7</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">8</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">9</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">10</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>

    </div>
```

```css masonry-wonky-bottom
.masonry {
      display: grid;
      gap: 1rem;
      grid-template-rows: masonry;
      /* magic responsiveness */
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

}

/* some styling not important */
.brick {
    color: var(--Text, #F0F0F0);
    background: var(--Primary, #74baff);
    padding:1rem;
}
```

This code will result in a masonry style layout, which automatically reduces the number of columns as the screen shrinks down, until you reach a single column.

![Animated resizing of demo showing masonry layout with responsive columns with css grid](/images/responsive-grid.gif)

If you run this example you should notice that there is no clean edge on the bottom, it has a `wonky bottom`.

![Image of result of demo showing masonry layout without a flat bottom](/images/wonky-bottom.png)

> No one likes a ~~soggy~~ wonky bottom.

The masonry specification also allows for a new property: `align-tracks`, which you can set to `stretch` to fix this problem.

`align-tracks` also has some other [support modes](https://developer.mozilla.org/en-US/docs/Web/CSS/align-tracks), beware of potential issues with `align-tracks` if you want a masonry layout where a "brick" can span multiple columns, hopefully these things will get ironed out as the spec progresses.

```html masonry-straight-bottom
    <div class="masonry">
        <div class="brick"><span class="num">1</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">2</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">3</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">4</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">5</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">6</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
        <div class="brick"><span class="num">7</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">8</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">9</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">10</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>

    </div>
```

```css masonry-straight-bottom
.masonry {
      display: grid;
      gap: 1rem;
      grid-template-rows: masonry;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      /* no more wonky bottom */
      align-tracks: stretch;
      /* just so you can see the edge in the example */
      padding-bottom: 3rem;

}

/* some styling not important */
.brick {
    color: var(--Text, #F0F0F0);
    background: var(--Primary, #74baff);
    padding:1rem;
}
```

And now as if by magic, the bottom edge is now straight.

![Image of result of demo showing masonry layout without a straight bottom](/images/responsive-straight.gif)

### What about a fallback

Okay, so now we made something work in a single browser only, and it's not even shipped there, not ideal.
Let's try to achieve something similar, this time with CSS columns.

I'd never used CSS columns before looking into them for implementing this masonry layout, they are actually quite clever, and they can made to be responsive, without media queries, which we will take a look at now.

For this example, i'm going to start to make use of [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) which will become extremely useful once we enable our progressive enhancement, we can use these variables to share sizes and other config.

For the css we're going to make use of some column properties:

```css
    column-gap: 1rem;
    column-fill: initial;
    column-width: 180px;
```

Setting a `column-width` will set a minimum width of a column before columns need to shrink down, meaning on smaller devices we can get a single column, the same as with our CSS grid implementation.

If you want to set a specific number of columns you can use the `column-count` property. You could adjust the number of columns using CSS media queries too, if you wanted to:

Optional example:

```css

/* larger */
@media (min-width: 1024px) {
  .masonry {
    column-count: 4;
  }
}

/* medium */
@media (max-width: 1023px) and (min-width: 768px) {
  .masonry {
    column-count: 3;
  }
}

/* small, anything smaller will be 1 column by default */
@media (max-width: 767px) and (min-width: 540px) {
  .masonry {
    column-count: 2;
  }
}
```

We're not going to do that, we're just going to make use of `column-width` and allow our columns to grow up to a maximum card width.

Same html as before, with some changes to the css:

```html masonry-fallback-basic
    <div class="masonry">
        <div class="brick"><span class="num">1</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">2</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">3</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">4</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">5</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">6</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
        <div class="brick"><span class="num">7</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">8</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">9</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">10</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>

    </div>
```

```css masonry-fallback-basic
.masonry {
    --masonry-gap: 1rem;
    --masonry-brick-width: 180px;
    column-gap: var(--masonry-gap);
    column-fill: initial;
    column-width: var(--masonry-brick-width);
}
.masonry > * {
    /* Sometimes elements get stuck between columns. */
    break-inside: avoid;
    /* add gap at bottom */
    margin-bottom: var(--masonry-gap)
}

/* some styling not important */
.brick {
    color: var(--Text, #F0F0F0);
    background: var(--Primary, #74baff);
    padding:1rem;
}
```

The result is very similar, however, there are two main differences:
- The order of items goes down the columns as opposed to across the rows with css grid. Columns: ⬇️ Grid: ➡️
- We have the wonky bottom back (there is no easy fix with css columns)

The first difference may be a deal breaker, depending on the use case, for me, order didn't really matter very much.

![Animated resizing of demo showing masonry layout with responsive columns with css columns](/images/responsive-column.gif)

## Progressive enhancement

Now we've seen how to implement a masonry layout in the future and with a fallback, lets put it all  together with the magical `@supports` keyword in css.

```css
@supports(grid-template-rows: masonry) {
    .masonry {
      display: grid;
      gap: var(--masonry-gap);
      grid-template-rows: masonry;
      grid-template-columns: repeat(auto-fill, minmax(var(--masonry-brick-width), 1fr));
      align-tracks: stretch;
    }

    .masonry > * {
        /* use this to reset the margin that the column variant set */
        margin-bottom: initial;
    }
}
```

Again, with no changes to the HTML again, we're going to implement an `@supports` just for the masonry layout using css grid:

```html progressive-enhancement
    <div class="masonry">
        <div class="brick"><span class="num">1</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">2</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">3</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">4</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">5</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">6</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
        <div class="brick"><span class="num">7</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">8</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">9</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">10</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>

    </div>
```

```css progressive-enhancement
.masonry {
    --masonry-gap: 1rem;
    --masonry-brick-width: 180px;
    column-gap: var(--masonry-gap);
    column-fill: initial;
    column-width: var(--masonry-brick-width);
}

.masonry > * {
    break-inside: avoid;
    margin-bottom: var(--masonry-gap);
}

@supports(grid-template-rows: masonry) {
    .masonry {
      display: grid;
      gap: var(--masonry-gap);
      grid-template-rows: masonry;
      grid-template-columns: repeat(auto-fill, minmax(var(--masonry-brick-width), 1fr));
      align-tracks: stretch;
    }

    .masonry > * {
        margin-bottom: initial;
    }
}

/* some styling not important */
.brick {
    color: var(--Text, #F0F0F0);
    background: var(--Primary, #74baff);
    padding:1rem;
}
```

Now with this example, depending on what your browser supports, you will either get the CSS Grid or the CSS Columns version.

As long as the `grid-template-rows: masonry` doesn't change between now and more browsers shipping, we have just written some CSS that will automatically upgrade itself over time, fixing the technical debt/UX "bug" of a wonky bottom and vertical ordering instead of horizontal.

## Bonus round

In my implementation I was toying around with having different cards backgrounds every nth "brick" in the masonry layout.

```css
.brick:nth-child(4n - 7) {
    background: #5A363A;
}

.brick:nth-child(4n - 6) {
    background: #82212C;
}

.brick:nth-child(4n - 5) {
    background: #3A3E41;
}

.brick:nth-child(4n - 4) {
    background: #292A2B;
}
```


There are some really neat tricks you can do with the `nth-child` property in CSS, some useful background reading if you are new to this:
- [How nth-child Works](https://css-tricks.com/how-nth-child-works/)
- [Useful :nth-child Recipes](https://css-tricks.com/useful-nth-child-recipies/)

Here's the full demo:

```html bonus
    <div class="masonry">
        <div class="brick"><span class="num">1</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">2</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">3</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">4</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">5</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">6</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
         <div class="brick"><span class="num">7</span> Lorem ipsum dolor inventore saepe maiores delectus? Quaerat excepturi repudiandae magnam in corporis? Corporis veritatis necessitatibus rem veniam explicabo iure ea incidunt ut dicta?</div>
        <div class="brick"><span class="num">8</span> Perspiciatis dolor qui deserunt animi, quidem temporibus nam doloremque maiores quae ullam, quibusdam consequatur consequuntur et corporis laboriosam est facere ratione quaerat odio quas dolore fugit rem officiis odit! Ad.</div>
        <div class="brick"><span class="num">9</span> Earum, voluptatum! Minima sapiente deserunt optio blanditiis, non atque voluptates libero molestias ipsam officiis reprehenderit ipsum tenetur deleniti quo dolore ut odio vero distinctio, error temporibus doloribus. Fugiat, accusantium aperiam!</div>
        <div class="brick"><span class="num">10</span> Voluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus. Nisi alias quis ab odit perspiciatis quisquam officVoluptatibus vel magnam a cupiditate at veniam eos voluptates harum incidunt minus.</div>
        <div class="brick"><span class="num">11</span> Suscipit cum nihil id voluptatem omnis officia dolor quia. Saepe perferendis, quas, fuga magnam iure soluta nemo eligendi dignissimos repudiandae maxime, beatae sapiente possimus obcaecati ab necessitatibus voluptatem numquam commodi.</div>
        <div class="brick"><span class="num">12</span> Inventore maiores velit possimus dolore in ipsa praesentium obcaecati. Velit nihil porro pariatur id culpa earum soluta ipsa autem repellat quisquam iure facilis totam sint, quod a quae delectus perferendis.</div>
        <div class="brick"><span class="num">13</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">14</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">15</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">16</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>
        <div class="brick"><span class="num">17</span> Accusamus voluptates hic assumenda magni molestiae distinctio architecto, nihil error atque corporis, laudantium quo, dolores voluptatum exercitationem vero aliquid tenetur illo doloribus numquam! Autem impedit ab omnis qui optio rem!</div>
        <div class="brick"><span class="num">18</span> Adipisci tempora id veniam quos eligendi amet aut beatae laborum? Impedit tenetur consequuntur quae rerum numquam, ut quisquam dolor odio, quia expedita harum, laborum corrupti? Debitis corporis quas odit consectetur.</div>
        <div class="brick"><span class="num">19</span> Labore vel asperiores at deleniti, optio explicabo minus dolorum culpa, totam perspiciatis maiores voluptas dicta excepturi facere nesciunt dolor ducimus aperiam nihil sint harum necessitatibus? Ullam, cupiditate! Ab, tempora alias.</div>
        <div class="brick"><span class="num">20</span> consequuntur temporibus omnis recusandae sunt, ratione excepturi quos voluptates obcaecati quo? Illum.</div>
    </div>
```

```css bonus
.masonry {
    --masonry-gap: 1rem;
    --masonry-brick-width: 180px;
    column-gap: var(--masonry-gap);
    column-fill: initial;
    column-width: var(--masonry-brick-width);
}

.masonry > * {
    break-inside: avoid;
    margin-bottom: var(--masonry-gap);
}

@supports(grid-template-rows: masonry) {
    .masonry {
      display: grid;
      gap: var(--masonry-gap);
      grid-template-rows: masonry;
      grid-template-columns: repeat(auto-fill, minmax(var(--masonry-brick-width), 1fr));
      align-tracks: stretch;
    }

    .masonry > * {
        margin-bottom: initial;
    }
}

/* some styling not important */
.masonry {
    background: #f3f3f3;
    padding: 2rem;
}
.brick:nth-child(4n - 7) {
    background: #5A363A;
}

.brick:nth-child(4n - 6) {
    background: #82212C;
}

.brick:nth-child(4n - 5) {
    background: #3A3E41;
}

.brick:nth-child(4n - 4) {
    background: #292A2B;
}
.brick {
    color: white;
    padding:1rem;
}
```

Thanks for reading all the way through, I hope this was useful and one day soonish we will be able to easily deal with wonky bottoms in just CSS.






