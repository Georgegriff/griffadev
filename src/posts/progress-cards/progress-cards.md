---
title: "Building progress indicator cards with a single css property"
description: I recently had to implement an indicator of progress onto a card component, I challenged myself to see if this could be done with a single css property, here's how.
date: "2021-10-19"
hero:
  image: "/images/progress-card.png"
  alt: "Image of a HTML card component with a progress indicator"
tags:
  - HTML
  - CSS
---

Here is a full demo of the css which I'll show you how to build, by learning the structure of the css `background` shorthand property.

```css full-demo
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem;
}
.progress-card {
  width: 30ch;
  padding: 2rem;
  border-radius: 5px;
  border: solid 1px #f1f1f1;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.5), 0px 2px 4px -1px rgba(0, 0, 0, 0.2);
  color: #6c3d3d;
  --progress-total: #faebd1;
  --progress-indicator: #65ad60;
  --progress-indicator-height: 10%;
  --progress-card-background: #ffdc9b;
  background: linear-gradient(
        to right,
        var(--progress-indicator) 0,
        var(--progress-indicator) var(--progress, 30%),
        var(--progress-total) var(--progress, 30%),
        var(--progress-total) 100%
      ) no-repeat 0 0/100% var(--progress-indicator-height), var(
        --progress-card-background
      ) no-repeat 0 0/100%;
}

p {
  font-weight: 600;
  font-style: italic;
}
```

```html full-demo
<div class="card-container">
  <div class="progress-card" style="--progress:40%;">
    <h4>Collect 5 Boar meat</h4>
    <p>In progress: 2 of 5</p>
  </div>

  <div class="progress-card" style="--progress:20%">
    <h4>Collect 5 pieces of Firewood</h4>
    <p>In progress: 1 of 5</p>
  </div>

  <div class="progress-card" style="--progress:86%">
    <h4>Collect 7 Raptor feathers</h4>
    <p>In progress: 6 of 7</p>
  </div>

  <div class="progress-card" style="--progress:60%">
    <h4>Collect five Iron ore</h4>
    <p>In progress: 6 of 10</p>
  </div>
</div>
```

Before today I've always shied away from full understanding all of the shorthand property capability that is baked into the background `attribute` but today i'm going to change that, let's work it out together, let's deconstruct this bit of css that constructs the progress indicator card together:

```css
.progress-card {
  background: linear-gradient(
        to right,
        #65ad60 0,
        #65ad60 30%,
        #faebd1 30%,
        #faebd1 100%
      ) no-repeat 0 0/100% 10%, #ffdc9b no-repeat 0 0/100%;
}
```

You might be thinking, why do this with a single css property? You could just do this with multiple css properties or html elements, heck even the built in `meter` html element. These things are all true however there may be some cases where just manipulating a single css property to create effects like this is handy:

- You're in a design system and you can only change the background property.
- You're in some system where you are unable to modify the HTML.
- It's fun.

## Breaking down the css background property

Prior to experimenting to create this effect i'd never really gone into too much detail about the capabilities of the background property in css, but it is really quite fantastic! The fact that you can apply multiple backgrounds and their properties using a single css property is very powerful and not something i'd really appreciated before.

To understand css snippet from above it would probably be a good idea to expand into using the non-shorthand background properties, to help understand and breakdown what's going on above:

```css
.progress-card {
  background: linear-gradient(
        to right,
        #65ad60 0,
        #65ad60 30%,
        #faebd1 30%,
        #faebd1 100%
      ) no-repeat 0 0/100% 10%, #ffdc9b no-repeat 0 0/100%;
}
```

is equivalent to:

```css
.progress-card {
  background-image: linear-gradient(
    to right,
    #65ad60 0,
    #65ad60 30%,
    #faebd1 30%,
    #faebd1 100%
  );
  background-color: #ffdc9b;
  background-size: 100% 10%, 100%;
  background-repeat: no-repeat;
}
```

What is going on is that we have two backgrounds:

- a `linear-gradient` which starts off green `#65ad60`, moving to the right and at 30% turns into light cream `#faebd1`.
- a block sand-like color of `#ffdc9b`.

Note how we are separating the background with a comma `,`. The same is done for `background-size`. `background-repeat` has just one value because I want the same value for each background, but I could have done `background-repeat: no-repeat, no-repeat`.

For the `background-size` property we first have width, followed by height. So the first background size says a width of 100% and a height of 10% which gives us the height of the progress bar. The `no-repeat` is important, without it the background would just duplicate itself until it filled 100% of the image, as repeat is the default. It's probably useful to note that you may have multiple background images too, which can be an image url or a gradient.

### Converting to shorthand

To convert the `background-image`, `background-color`, `background-size` and `background-repeat` to the shorthand `background` it's similar to the long form properties. There is a slightly different syntax for `background-size` as you also need to account for `background-position` which is a property which I have omitted from my long hand, it would be something like:

```css
.progress-card {
  background-image: linear-gradient(
    to right,
    #65ad60 0,
    #65ad60 30%,
    #faebd1 30%,
    #faebd1 100%
  );
  background-color: #ffdc9b;
  background-size: 100% 10%, 100%;
  background-repeat: no-repeat;
  /* this is the default */
  background-position: 0 0;
}
```

In order to specify the `background-size` when using the `background` shorthand you must also specify the position, to do this you separate the position and the size with a forward-slash `/`.

For example, here is the first of the backgrounds:

```css
background: [image] [repeat] [position-x] [position-y] / [width] [height];
```

```css
.progress-card {
  background: linear-gradient(
      to right,
      #65ad60 0,
      #65ad60 30%,
      #faebd1 30%,
      #faebd1 100%
    ) no-repeat 0 0/100% 10%;
}
```

Whilst writing this article I came across [this handy website](https://shrthnd.volume7.io/) that generates the shorthand for you, test it out with the above css, you should get a single `background` property generated for you!

> Internally it looks like this website uses this package: https://github.com/frankmarineau/shrthnd.js.

Hopefully you can now see how we got to the final css, by adding in the`background-color` and position values after a comma `,`.

```css
background: linear-gradient(
      to right,
      #65ad60 0,
      #65ad60 30%,
      #faebd1 30%,
      #faebd1 100%
    ) no-repeat 0 0/100% 10%, #ffdc9b no-repeat 0 0/100%;
```

There is a lot more to the css background property, as always, your best bet for research is [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/background).

## Spicy CSS Custom properties

Now we've had a play with the background property, let's see if we can make the css a little more useful, by introducing css custom properties we now have the possibility of re-using the same css with different values for percentage "progress", or changing the background colors.

> If you are new to CSS Custom properties Kevin Powell does a great introduction over [here](https://www.youtube.com/watch?v=PHO6TBq_auI).

```css
.progress-card {
  width: 30ch;
  padding: 2rem;
  border-radius: 5px;
  border: solid 1px #f1f1f1;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.5), 0px 2px 4px -1px rgba(0, 0, 0, 0.2);
  color: #6c3d3d;
  --progress-total: #faebd1;
  --progress-indicator: #65ad60;
  --progress-indicator-height: 10%;
  --progress-card-background: #ffdc9b;
  background: linear-gradient(
        to right,
        var(--progress-indicator) 0,
        var(--progress-indicator) var(--progress, 30%),
        var(--progress-total) var(--progress, 30%),
        var(--progress-total) 100%
      ) no-repeat 0 0/100% var(--progress-indicator-height), var(
        --progress-card-background
      ) no-repeat 0 0/100%;
}
```

```html
<div class="card-container">
  <div class="progress-card" style="--progress:40%;">
    <h4>Collect 5 Boar meat</h4>
    <p>In progress: 2 of 5</p>
  </div>

  <div class="progress-card" style="--progress:20%">
    <h4>Collect 5 pieces of Firewood</h4>
    <p>In progress: 1 of 5</p>
  </div>

  <div class="progress-card" style="--progress:86%">
    <h4>Collect 7 Raptor feathers</h4>
    <p>In progress: 6 of 7</p>
  </div>

  <div class="progress-card" style="--progress:60%">
    <h4>Collect five Iron ore</h4>
    <p>In progress: 6 of 10</p>
  </div>
</div>
```

Hopefully you can see how you can change the look of each "card" just by modifying the css custom property for that card only.

Here is a live demo of the html and css: https://codepen.io/georgegriff/pen/RwZRBeJ

## Make it a component

You could next choose to create a re-usable component, for example a Web Component, that could set the css custom properties and add appropriate aria attributes.

It's important to note that this css-based progress indicator is purely decoration, you will want to ensure that users with screen readers are able to understand what the component is conveying, using aria attributes in your HTML, or appropriate text labels.

> You can learn about ARIA basics on MDN [here](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics).

Thank you for reading! If you want to read more of my work, please follow me on Twitter [@griffadev](https://twitter.com/griffadev), or get me a [coffee](https://ko-fi.com/griffadev) if you feel like it ☕.
