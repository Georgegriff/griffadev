---
title: 'Setting up ESLint to work with new or proposed JavaScript features such as private class fields.'
description: It turns out configuring ESLint to use Stage 3 proposals is actually a massive pain, and sends you down a rabbit hole of Babel, assumed knowledge, renamed packages and half answered questions.
date: '2020-12-01'
hero:
  image: "/images/eslint-classes.png"
  alt: 'Picture of JavaScript class showing invalid syntax for a private class member'
tags:
  - QuickTip
  - JavaScript
  - ESLint
  - Jest
  - Babel
---

Some members in my team this week wanted to make use of [Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) in a NodeJS server. This proposal is currently shipped in Chrome, Edge, Firefox and NodeJS, with Safari notably absent. In this instance, we wanted to get them working for a backend server application, so support since Node 12, we're good to go, or so I thought, turns out linters aren't always here to save you time.

I summed my feelings on the whole process of figuring this out on Twitter.

{% twitter "1333779719074955264" %}

Feel free if you want to skip ahead past the story, and to head right to [Configuring ESLint](#configuring-eslint).

For this article, i'll be using this code example of using Private class fields, the code used is irrelevant.

```js
export class Animal {
    // this is a private class field!
    #noise = '';

    constructor(noise) {
        this.#noise = noise;
    }

    makeNoise() {
        console.log(this.#noise);
    }
}
```

The first issue we hit when writing this new code, was of course, the linter started failing, so off to Google we went!

## Struggling to finding a solution

A quick search for: `eslint private class fields` you will most likely end up in this [Stack Overflow issue](https://stackoverflow.com/questions/57385125/eslint-does-not-recognize-private-field-declaration-using-nodejs-12).
It will tell you that ESLint does not support experimental stage 3 features, which is indeed correct, and to:

```bash
npm install eslint babel-eslint --save-dev
```

and to update your ESLint config file over to use:

```json
  "parser": "babel-eslint",
```

Sadly, it seems this is not an entire solution, it seems to make a couple of assumptions:
- You have babel-core installed
- You have a babel configuration file set up that knows how to transform code with a preset.
- Its possible that when the answer was posted `babel-eslint` did indeed solve al the problems.

If you are in a NodeJS server module, a lot of these assumptions are probably not met.

If you are a developer that has never had to use Babel because you work on the backend or on a build-less frontend, all this stuff can get daunting very fast.

Additionally, it seems since this answer was posted, things have moved on and the recommended `parser` now lives at:

```json
    "parser": "@babel/eslint-parser",
```

The ESLint website does have some information about the Past, Present and Future of the babel-eslint over on its [website](https://babeljs.io/blog/2020/07/13/the-state-of-babel-eslint).

Finding this information out was a bit of an adventure, and even on the official babel or ESLint website, it's super unclear that you need to set up a babel config, and then still, what to put in it. I'm pretty sure the only reason I managed to figure it out in the end was because i'm familiar with the mess that is configuring Webpack, Jest and Babel.

## Configuring ESLint

Let's get our new syntax working!

First off, lets do the `npm install` dance:

```js
npm i eslint @babel/core @babel/eslint-parser @babel/preset-env -D
```

It's nice to set up a linter task in your package json so you can run `npm run lint`

```json
  "scripts": {
    "lint": "eslint ./"
  },
```

I'm opting to use `@babel/preset-env` because it has an easy way to enabled proposals that are `shipped` in Browsers/Node. Other presets/plugins are available.

Next we need to construct an `.eslintrc` file.
You can generate one using: `./node_modules/.bin/eslint --init` or just copy this starter:

```json
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
    }
}
```

Now if you run `npm run lint` You will hit the following error:

```js
/path/to/code/Animal.js
  0:0  error  Parsing error: No Babel config file detected for /path/to/code/Animal.js. Either disable config file checking with requireConfigFile: false, or configure Babel so that it can find the config files

✖ 1 problem (1 error, 0 warnings)
```

It's telling you we need to configure babel for `@babel/eslint-parser` to work.

Lets set up a babel config file.

Create a file called `.babelrc` and populate it with:

```json
{
  "presets": [
    ["@babel/preset-env"]
  ]
}
```

You can read about `@babel/preset-env` on the [Babel website](https://babeljs.io/docs/en/babel-preset-env).

Now if you run `npm run lint` again you will hit the final error:

```js
/path/to/code/Animal.js
  2:4  error  Parsing error: /path/to/code/Animal.js: Support for the experimental syntax 'classPrivateProperties' isn't currently enabled (2:5):

  1 | export class Animal {
> 2 |     #noise = '';
    |     ^
  3 | 
  4 |     constructor(noise) {
  5 |         this.#noise = noise;

Add @babel/plugin-proposal-class-properties (https://git.io/vb4SL) to the 'plugins' section of your Babel config to enable transformation.
If you want to leave it as-is, add @babel/plugin-syntax-class-properties (https://git.io/vb4yQ) to the 'plugins' section to enable parsing

✖ 1 problem (1 error, 0 warnings)
```

> You could proceed to add plugins for each of the proposals as the instructions say, alternatively you can opt to say `I want all shipped proposals`.

To do this change your `.babelrc` over to:

```json
{
    "presets": [
      ["@babel/preset-env",
      {
        "shippedProposals": true
      }]
    ]
  }
```
> From the Babel docs: "set the shippedProposals option to true. This will enable polyfills and transforms for proposal which have already been shipped in browsers for a while."

## If you are using Jest

If you are using Jest, it will automatically pick up `.babelrc` files, this might be problematic, as it will very helpfully start to try to transpile things like `async/await`, potentially leading you down even more rabbit holes. With really helpful messages like:

```js
ReferenceError: regeneratorRuntime is not defined
```
By dumb luck, i've been through the pain of this message many times, and knew exactly what was wrong, Jest was trying to transform the perfectly valid code.

It's almost 2021, and this is a server app, I certainly do not want to transpile `async/await` especially not in unit tests!

One way to work around this is to use a non-standard name for your `.babelrc` file e.g. `.babel-eslintrc`. There may be better solutions, but I certainly don't want Jest unnecessarily transforming code.

In your `.eslintrc` file you can update `babelOptions` to use a custom `configFile`

```js
"babelOptions": {
    "configFile": "./.babel-eslintrc"
 }
```

And there we go, Jest is now happy again because it's not using the Babel configuration.

### Summary

All in all this was a lot harder than I thought it would be, my guess is that many people don't hit this issue because they happen to already have Babel configured. But in the case of backend dev, getting along happily, just trying to make use of a shipped JavaScript feature in a server, you can get dragged into the hellscape of frontend development tooling, and no one has fun there.
