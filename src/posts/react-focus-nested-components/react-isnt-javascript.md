---
title: Just a friendly reminder that React isn't really Just JavaScript (Don't nest Functional Components)
description: React is super popular and has often touted itself as "Just JavaScript", but in reality it has lots of quirks and gotchas that come along with it being a framework that adds limitation into JavaScript. Oh, and also write tests!
tags:
  - JavaScript
  - React
  - Accessibility
date: "2021-11-06"
---

This is my first blog post I've written about React, despite reluctantly using it every day due to the UK frontend job market. I'll probably regret talking about such a popular Framework, oh and it is a Framework 😉.

Recently, I was writing an animated slide-in sidebar component, which could be opened to reveal some additional details for another component in the page. One of my goals was to ensure that the tab and focus order of the page made sense when the details pane was opened, namely, I wanted to be able to "steal" focus on open and restore focus back to the original button on close. For example on button press (with space-bar) you should be able to open the details panel, have the panel but focused and close it again with the space-bar. Focus is then returned back to the original button and you can hit "tab" to move to the next item.

Here is a simplified example of what I wass building, with some HTTP Status code kitties, try it out for yourself over in [this Code sandbox](https://codesandbox.io/s/http-status-cats-working-8tr1l?file=/src/App.jsx).

![Animation showing using the keyboard and focus state to open and close a panel](/images/focus-drawer.gif)

Here is the code for the App, this was hastily written HTML which i'm sure could do with being improved.

```js
import "./styles.css";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
export default function App() {
  const statusCodes = [500, 404, 403, 401, 418, 420, 301, 302, 200, 201, 204];
  const [selectedCode, setSelectedCode] = useState(null);

  const Codes = (
    <ul>
      {statusCodes.map((code) => (
        <li key={code}>
          <button onClick={() => setSelectedCode(code)}>{code}</button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="App">
      <h1>HTTP Status Cats</h1>
      {Codes}
      <Sidebar
        onClose={() => setSelectedCode(null)}
        ariaLabel={`${selectedCode} status code info`}
        open={Boolean(selectedCode)}
      >
        <h2>{selectedCode}</h2>
        <img
          alt={`Cat demonstrating HTTP status code: ${selectedCode}`}
          src={`https://http.cat/${selectedCode}.jpg`}
        />
      </Sidebar>
    </div>
  );
}
```

And the sidebar, which is where the "focus stealing/restoring" happens:

```js
import { useEffect, useRef, useState } from "react";

export const Sidebar = ({ ariaLabel, open, onClose, children }) => {
  const [previousFocus, setPreviousFocus] = useState();
  // now focus inside something, for arguments sake, the close button
  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (open) {
      setPreviousFocus(document.activeElement);
      closeBtnRef?.current?.focus();
    }
    // bit of a hack putting aria label in here so triggers if another option selected.
  }, [open, ariaLabel, closeBtnRef]);

  return (
    <aside aria-label={ariaLabel} aria-hidden={open ? "false" : "true"}>
      <button
        disabled={!open}
        ref={closeBtnRef}
        onClick={() => {
          // restore previous focus
          previousFocus?.focus();
          onClose();
        }}
      >
        Close X
      </button>
      {open && children}
    </aside>
  );
};
```

This code was working correctly, and then I was working on another pr based on a branch with new changes that I pulled in and I noticed that the focus navigation had started failing.

> Actually, a unit test, which tested the focus interactions started failing which is actually pretty awesome! React Testing Library moved unit testing forward SO MUCH in comparison to Enzyme it's great. If it could only run by default inside a browser instead of Jest, that would be great. By default I mean, commonplace in the industry, i'm sure it's achievable.

In my example above the new PR had added the equivalent of the `Codes` variable which is in the above snippet:

```js
const Codes = (
  <ul>
    {statusCodes.map((code) => (
      <li key={code}>
        <button onClick={() => setSelectedCode(code)}>{code}</button>
      </li>
    ))}
  </ul>
);
```

```js
<h1>HTTP Status Cats</h1>;
{
  Codes;
}
```

Except, that wasn't what was added, this was:

```js
const Codes = () => (
  <ul>
    {statusCodes.map((code) => (
      <li key={code}>
        <button onClick={() => setSelectedCode(code)}>{code}</button>
      </li>
    ))}
  </ul>
);
```

```js
<h1>HTTP Status Cats</h1>;
{
  <Codes />;
}
```

The difference is very subtle, but very important, what had been added by making `Codes` a function was a functional React component nested inside of another functional component. Remember `Codes` was a variable inside of `App`. This is the sort of thing which can easily not get picked up in code review but it breaks a lot of things.

Here is a broken example: https://codesandbox.io/s/http-status-cats-broken-fiu72?file=/src/App.jsx:508-554

![Animation showing broken focus on close of the panel](/images/focus-drawer-broken.gif)

What's going on here is React is rendering the contents of the "App" component on each render and because the inner component is not memoized or anyway react is just throwing it in the bin and re-rendering. Internally this will be causing the dom element to be removed and re-added thus breaking the focus state being returned to the original button.

Seeing this in the code, it was a non obvious fix, especially when reviewing another persons code, it got me thinking on some things:

- Would we have even caught this if we didn't have good tests?
- Would we have ever found the cause of it months later when the code wasn't as fresh in the mind?
- If React is "Just Javascript" how come it so royally breaks one of JavaScript best features of nesting functions and creating closures.
- Why isn't this front and center of React docs and default lint rules?

I did some digging on the last two points:

The only reference to nested functions that I could find in the official documentation comes from the old classic ["Rules of Hooks"](https://reactjs.org/docs/hooks-rules.html) page: `Don’t call Hooks inside loops, conditions, or nested functions`, no mention of nested components though.

> As an aside, I love the the fact that the mechanism that React is now mostly entirely based on, "hooks", requires a list of rules to help prevent you from writing "Just JavaScript".

As for a lint rules, there does appear to be one which you can turn on in the popular `eslint-plugin-react` - [no-unstable-nested-components](https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/no-unstable-nested-components.md), maybe i'll suggest to my team that we do. I can't think of a good reason when you would want to nest functional component, even if you're getting fancy and using useMemo, surely you'd just be better off writing simpler code.

I find it fun to think that such a tiny change in the code that looks so innocent can break quite a lot in the rendering of React components and something I learnt from this is i'm really going to do my best to make sure I write good sets of unit tests that test both "interactions" and "accessibility" as it's so easy for these things to regress!

Thank you for reading! If you want to read more of my work, please follow me on Twitter [@griffadev](https://twitter.com/griffadev), or get me a [coffee](https://ko-fi.com/griffadev) if you feel like it ☕.
