---
title: Type checking global JavaScript libraries in VS Code for when you just want learn and code.
description: Sometimes when you're prototyping and learning a new library you want a quick way to get type-checking/intellisense/auto-complete to assist with your learning. Here is a quick way to enable type checking without fully opting into TypeScript.
tags:
  - JavaScript
  - VSCode
  - TypeScript
  - TensorflowJS
date: "2021-04-18"
hero:
  image: "/images/documentation.png"
  alt: "VS Code documentation for the tensor2d function."
---

I've been learning a little bit of artificial intelligence/machine learning in my spare time and I recently started learning a little TensorflowJS. The quickest and simplest way of getting TensorflowJS is a good old script tag. When you are experimenting and prototyping you _really_ don't want to waste time with build tools.

Whilst this tutorial explains setting up basic type-checking for TensorflowJS it should work for any global library that has TypeScript documentation. When building a production project you may want to consider build tools, but for Machine learning experiments, I find you just want to get to the coding using documentation and examples.

This post explains how you can prototype with files from a CDN whilst opting in to certain nice-to-have features of TypeScript that can assist with learning a library, without fully adopting TypeScript.

You can just load TensorflowJS like so:

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
```

Doing so will make the library available on the global `window` object as `tf`

e.g.

```js
window.tf; // the Tensorflow library
```

One downside to doing this is that when you are working with Tensorflow you won't get any auto-complete in your IDE/Editor, because there are no import references for VS Code (or other) to analyze, unlike if you were to use ES6 Imports or Common JS require statements.

Let's take a look at how we can make no changes to the code but give you some nice type checking, and the real bonus for learning a library: inline documentation, which is so fantastic.

> Whilst this tutorial explains how to enable type-checking and library documentation in VS Code, it may work for other IDEs, the reason VS Code is so great here is its built in TypeScript support.

## Type checking on a global library

Create a directory and open it up in VS Code.

> If you don't have it yet, you can download VS Code over [here](https://code.visualstudio.com/download).

Create a simple HTML file called `index.html` with two script imports, one for the library and one for your code.
We won't actually boot up this file on a server and load it in a browser in this tutorial, but I'm putting this in for completeness.

```html
<!DOCTYPE html>
<html lang="en">
  <head> </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
    <script src="./index.js"></script>
  </body>
</html>
```

The reason for creating a separate `index.js` instead of inline JavaScript in a `<script>`, is as far as I could find, type checking does not seem to work in HTML files. If there is a way to get it to work easily, I'd love to know!

If you don't have one yet, first initialise an NPM project in your directory, you may be able to do this without an NPM project by using global libraries with `-g`, I haven't tried this though.

> If you don't have NodeJS and NPM installed you can download it here: [https://nodejs.org/en/](https://nodejs.org/en/).

Install the TensorflowJS library, we won't actually be using the code in the library, this is for just referencing the types, which come along with the NPM module.

```bash
npm i @tensorflow/tfjs
```

Next up we're going to create a [TypeScript declaration file](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html).
In this file we're going to tell TypeScript that the TensorflowJS library will be available on the global `Window` interface with a variable named `tf`

Create a file called `index.d.ts`

```ts
interface Global {
  tf: typeof import("@tensorflow/tfjs");
}

interface Window extends Global {}
```

Now finally create `index.js` and open it up.

Inside the file put the following at the top:

```js
/// <reference path="../index.d.ts" />
const tf = window.tf;
```

> If you want find out more about the notation with the triple-slashes, you can find out more in the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)

Now here comes the magic, when typing you will now get auto-complete, for example if you type `tf.` you should get some suggestions 🥳.

![When typing 'tf.' VS Code now provides auto-completion.](/images/auto-complete.png)

But the really fantastic thing here, and where it can really help if you are learning the library, is if the library author provides good function documentation you have that available right in your editor.

![VS Code documentation for the tensor2d function.](/images/documentation.png)

## Adding simple Type-checking

You can also add strict type-checking with single comment in a file.

In index.js add the following to the top of your file.

```js
// @ts-check
```

You should now see that when you code you will get type warning, like so:

![Code: 'tf.tensor2d(420)', showing error Argument of type 'number' is not assignable to parameter of type 'TensorLike2D', in VS Code](/images/type-checking.png)

Congratulations, you have now adopted TypeScript!
If you wanted to, you could even define your own types in `index.d.ts`.

If you want to learn more about ways of adopting TypeScript in small ways, this is a really great video that shows the different "degrees" of adopting TypeScript in a project, without needing to go "all in".
{% youtube "BHYgpbPC4wM" %}

## Learning TensorflowJS

If you want to learn more about Machine learning/Tensorflow, I got inspired by watching content from [Jason Lengstorf](https://twitter.com/jlengstorf) from his [Learn with Jason](https://www.learnwithjason.dev/) series, which I highly recommend (if it wasn't obvious already). One of the truly awesome things about this series is closed captioning is provided, making this content more accessible to everybody 🎉.

At the time of writing there are 3 sessions relating to Machine Learning and TensorflowJS, here is one of them:
{% youtube "WIHZ7kjJ35o" %}

I hope this was a good read, if you feel like reading more of my ramblings, please follow me on X [@griffadev](https://twitter.com/griffadev).
