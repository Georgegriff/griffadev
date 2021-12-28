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

Of course, all of the "Copy buttons" on this website use `copy-component` :).

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
  background: rgba(0, 0, 0, 0.3);
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
<copy-component>
  <p>
    Hello<br />
    world
  </p>
  <button id="copy-button" slot="button">Copy</button>
</copy-component>
```

```js event-usage
document.body.addEventListener("copy", () => {
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

## Web Component library

Here's an example using the component within lit

```js lit-copy
import { LitElement, html, css } from "https://cdn.skypack.dev/lit";
import "https://cdn.skypack.dev/copy-component";

class CopyToClipboard extends LitElement {
  constructor() {
    super();
    this._copyText = "Copy text";
    this._copiedText = "Copied!";
    this._copyFailed = "Failed! :(";
    this.copyText = this._copyText;
  }
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        margin: 0.5rem;
        padding: 0.5rem;
        position: relative;
        border: 2px dashed #82212c;
        max-height: 450px;
        overflow: auto;
      }
      :host([hidden]) {
        display: none;
      }

      button {
        font-family: inherit;
        text-transform: uppercase;
        background: #82212c;
        color: #1a1a1a;
        font-size: 1rem;
        font-weight: 600;
        padding: 0.25rem 1.5rem;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0;
        border: none;
        cursor: pointer;
        z-index: 1;
        height: 2.5rem;
        margin-left: auto;
      }

      button:active {
        background: #5a363a;
      }

      .floating-btn {
        position: absolute;
        top: 0;
        right: 0;
      }

      ::slotted(*) {
        margin: 0 !important;
        height: 100%;
        padding-bottom: 2.5rem;
      }
    `;
  }

  _onCopy() {
    this.copyText = this._copiedText;
    this.requestUpdate();
  }

  _onCopyFailed() {
    this.copyText = this._copyFailed;
    this.requestUpdate();
  }

  render() {
    return html`
      <copy-component
        @copy=${this._onCopy.bind(this)}
        @copy-failed=${this._onCopyFailed.bind(this)}
      >
        <slot></slot>
        <button
          slot="button"
          class="floating-btn"
          aria-label="Copy to clipboard"
        >
          ${this.copyText}
        </button>
      </copy-component>
    `;
  }
}

customElements.define("copy-it", CopyToClipboard);
```

```html lit-copy
<copy-it>
  <p>Some text to copy</p>
  <br />
  <p>Formatting is preserved!</p>
</copy-it>
```
