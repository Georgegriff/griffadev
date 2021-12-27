---
date: "2021-12-27"
description: "A zero dependency vanilla custom element that adds the capability to wrap html so it the inner text can be added to the users clipboard."
layout: layouts/copy-component.njk
project:
  data:
    linkText: Source
    github:
      repository: copy-component
      stars: true
      user: Georgegriff
    npm: copy-component
    type: Web Component
    url: "https://github.com/Georgegriff/copy-component"
title: copy-component - a vanilla web component
---

## Installation

Install the package:

```bash
npm install copy-component
```

Import the module to be handled by your bundler (or not). If you'd prefer to just embed the library in your code you can import it directly from a CDN, shown below.

```js
import "copy-component";
```

From CDN:

```html
<script type="module" src="https://cdn.skypack.dev/copy-component?min"></script>
```

## Basic usage

Any HTML inside of the `copy-component` tag will be made copy-able. You will likely want to add in a button to trigger the copy, to do this you must set the attribute `slot="button"` on your button (or a parent of the button). Formatting is preserved on copy.

Of course, all of the "Copy buttons" use `copy-component` :).

```html basic-usage
<script type="module" src="https://cdn.skypack.dev/copy-component?min"></script>
<copy-component>
  <p>
    Hello<br />
    world
  </p>
  <button slot="button">Copy</button>
</copy-component>
```

```css basic-usage
copy-component {
  position: relative;
  border: 2px lightgrey dashed;
}

copy-component *:not([slot="button"]) {
  margin: 1rem;
}
copy-component button {
  position: absolute;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  top: 0;
  right: 0;
  border: none;
}

copy-component button:active {
  background: rgba(0, 0, 0, 0.8);
}
```

## Events

Custom events are fired the following:

`copy` - when copy succeeds
`copy-failed` - when copy fails

```html event-usage
<script type="module" src="https://cdn.skypack.dev/copy-component?min"></script>
<copy-component>
  <p>
    Hello<br />
    world
  </p>
  <button id="copy-button" slot="button">Copy</button>
</copy-component>
```

```js event-usage
document.body.addEventListener("copy-success", () => {
  document.getElementById("copy-button").innerText = "Copied!";
});
```

```css event-usage
copy-component {
  position: relative;
  display: flex;
  border: 2px lightgrey dashed;
}

copy-component *:not([slot="button"]) {
  margin: 1rem;
}
copy-component button {
  position: absolute;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  top: 0;
  right: 0;
  border: none;
}

copy-component button:active {
  background: rgba(0, 0, 0, 0.8);
}
```

Check out the [codepen](https://codepen.io/georgegriff/pen/XWeVgBV).
