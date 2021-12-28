---
title: Beautiful drag and drop interactions with react hooks.
description: Recently I needed to enhance a table with drag and drop re-ordering in React. There are lots of solutions out there from roll your own to a library with large dependencies. In this article I explore using an exciting new library called dnd-kit as well as how to integrate it with react-table.
tags:
  - JavaScript
  - React
date: "2021-12-20"
hero:
  image: "/images/react-table-dnd-kit.png"
  alt: "Drag and drop table using react-table and dnd-kit"
---

In this article we'll explore how you could build a drag and drop sortable table.

![Drag and drop table using react-table and dnd-kit.](/images/react-table-dnd-kit.png)

When looking for drag and drop libraries in React there are a lot of options, some of the popular ones are:

- [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) - considered deprecated in favour of dnd-kit.
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [react-dnd](https://react-dnd.github.io/react-dnd/about)
- [dnd-kit](https://dndkit.com/) which we're going to explore today.

Many of the libraries out there are great but some come with some large downsides, namely:

- Are intended for specific use-cases or are too restrictive.
- Have a large dependency tree, for example some bundle in redux!
- Have inconsistent browser support.

One common thing also brought up when looking at these libraries is those that opt to "use the platform" more by utilising the HTML drag and drop APIs and those that deliberately choose to not use it to overcome browser inconsistencies and help improve support for a variety of inputs such as touch, mouse and keyboard.

As part of this investigation I seriously considered `react-beautiful-dnd`, whilst it has great support and demos, I hit a few stumbling blocks along to way. It's [footprint](https://bundlephobia.com/package/react-beautiful-dnd@13.1.0) was also a hard sell to add into the application for a single use-case. I also encountered [this issue](https://github.com/atlassian/react-beautiful-dnd/issues/316) whilst I was investigating a different use case where I wanted horizontal and vertical re-ordering in a grid.

After trying out some other libraries I eventually settled on @dnd-kit, which I have to say is absolutely fantastic. It is technically still in beta, but despite this its documentation is quite mature. On the [docs](https://docs.dndkit.com) site it says the following:

> dnd kit is currently in beta. Issues and bugs should be expected for early releases. The core concepts are stable, but some of the APIs may change in the future.

## So why is this library great?

It is a lightweight, hooks-based, utility driven library which gives you helpful primitives and allows you to opt in for additional features, therefore making the library only as large as your use case requires it be, depending on what you need.

The easiest way to get started I think is to work through some of the code in some of their code [sandbox demos](https://codesandbox.io/examples/package/@dnd-kit/core). I'm personally a big fan of the [sortable image grid example](https://codesandbox.io/s/py6ve), try breaking down the code to see how things work.

The first step to using `dnd-kit` is to install the packages you need. The library is separated into small micro-libraries, which each provide additional utilities.
The minimum you will require is the package `@dnd-kit/core` (~11KB gzipped).

Some other useful packages with `dnd-kit` provides:

- `@dnd-kit/sortable` - building blocks to build sortable interfaces .(~3KB gzipped)
- `@dnd-kit/utilities` - dnd-kit utilities to help with integration. (~1.3KB gzipped)
- `@dnd-kit/modifiers` - modifiers to change behavior of drag and drop, for example restricting the drag and drop movement to vertical or horizontal. (~3.4KB gzipped)
- `@dnd-kit/accessibility` - Hooks to assist with accessibility for example screen reader announcements. (~499B gzipped)

## Webpack problems

Note, in my use I found that webpack had some issues de-duplicating `@dnd-kit/core` which is used inside of `@dnd-kit/sortable`. Aside from adding to bloat, if this dependency is not de-duplicated the `DndContext` provided by `dnd-kit` will not work. If you run into this you can force it use the same copy of the core library, using an alias in your webpack.config.js.

```js
  resolve: {
    alias: {
      // without this webpack dupes the dependencies when other dnd-kit libs use it which breaks context
      "@dnd-kit/core": path.resolve(__dirname, "node_modules/@dnd-kit/core"),
    }
  }
```

## Learning dnd-kit

The best way that I can recommend to understand the library before we get to the example using react-table is to take a look at the example I mentioned earlier ([sortable image grid example](https://codesandbox.io/s/py6ve)).

One thing to highlight that is important and quite cool about the library is its `DragOverlay` component, which you can use to render a custom react component to visualise your dragged item differently when it is being dragged, for example adding a drop shadow, which you'll notice in my sortable table example a little later. It also offers you the opportunity to change how the original rendered item is rendered when it is being dragged by using the `isDragging` property from `useSortable` (or `useDraggable`), for example change it's opacity or color to help indicate the drop area to the user, this is also shown in my up-coming example.

If you prefer to learn through videos, whilst learning the API I watched some of this video before getting my hands stuck into the code.

{% youtube "eDc2xowd0RI" %}

## What could be better?

The library has some really fantastic examples of how to use it on its [storybook](https://5fc05e08a4a65d0021ae0bf2-unebtvimdp.chromatic.com/), however they do suffer from the classic problem that storybook often presents, they are great as showcases but not very good at demonstrations of how to adapt the example to use the code for yourself. By that I mean, it's very hard to find and understand the code written, and often suffers from the problem of "too much code re-use for demos", although if I'm honest I think this is a problem with Storybook not the library itself.

For example, it's really hard to un-pick what the code in the example is doing, you end up having to search through github and reverse engineer complex examples and across multiple files, for example:

- https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/1-Vertical.story.tsx
- https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/Sortable.tsx

The other thing that makes me sad is that this great library is locked into the React ecosystem, but I must admit, the ergonomics of using custom hooks here is quite nice.

## Using react table

[react-table](https://www.npmjs.com/package/react-table) is another lightweight and customisable react library, it allows users to use utilities and hooks to build up tables for their UIs. This description may sounds quite similar to what I described before about `dnd-kit` where you can use a series of utilities and hooks to implement drag and drop. It is for this reason that`react-table` and `dnd-kit` fit together really nicely.

To help demonstrate this, I took the "basic" example of `react-table` from their examples here: https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/basic and then added in drag and drop support, let's have a look how.

## Hooking it up

In order to add support there are roughly these steps:

- Install the `dnd-kit` packages: @dnd-kit/core, @dnd-kit/modifiers, @dnd-kit/sortable, @dnd-kit/utilities.
- Wrap the table in `DndContext` and `SortableContext`.
- Provide an array of string item ids to `SortableContext` to allow items to be sorted.
- Implement drag event handlers for re-ordering items in the array.
- Render a row using the `useSortable` hook passing in the id of the row.
- Render a drag handle button component.
- Render the CSS transform of the row when dragging.
- Rendering the `DragOverlay` for a custom view of the row when dragging.
- When a row is being dragged change it's background color and hide the data, using the `isDragging` property, to act as a "slot" for the user to drop into.

Here is an implementation of how you could go about doing drag and drop re-orderable rows with `dnd-kit` and `react-table`: https://codesandbox.io/s/react-table-drag-and-drop-sort-rows-with-dnd-kit-btpy9

This example isn't really focused on making it look "pretty", it needs lots of styling to make it more production ready but hopefully you get the idea.

One really important thing that is missing in the example is custom screen reader messages for accessibility, you will want to do this to help make sure that your application is inclusive of everybody. There is a great example on the [dnd-kit accessibility page](https://docs.dndkit.com/guides/accessibility).

I'm excited to explore difference uses for this library, once you get the hang of it it's really powerful!

Thank you for reading! If you want to read more of my work, please follow me on Twitter [@griffadev](https://twitter.com/griffadev), or get me a [coffee](https://ko-fi.com/griffadev) if you feel like it ☕.
