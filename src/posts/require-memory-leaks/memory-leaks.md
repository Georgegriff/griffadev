---
title: Memory leaks in NodeJS and why should never write bad code "just for tests".
description: That feeling when you see some awful code, and realise your wrote it. Here's a story of how some bad code I wrote in a unit test, that made it into production and caused a memory leak in our NodeJS application.
tags:
  - JavaScript
  - NodeJS
  - ExpressJS
  - Kubernetes
date: 18-03-2021
---

A project that I work on started showing crashed Pods in our Kubernetes (K8s) cluster, which runs a NodeJS server in a container, it was failing with a dreaded "OOMKilled" (Out of memory killed) error,
which sent down the path of learning about profiling NodeJS applications for memory leaks. If you don't know much about Kubernetes, that doesn't matter for this article, the fact the NodeJS application is running in K8s is incidental to the tale, and I will only mention it briefly when discussing debugging in Kubernetes.

I learnt a lot through investigating this memory leak in our application, not just about memory profiling but about the risk of writing "quick and dirty code", even if it's not for production use.

Here is an obfuscated and simplified explanation of the terrible, terrible code that I originally wrote.

## The bad code

So, a few months ago I wrote some code some unit tests which exercised some file validation logic, when I wrote this code I needed to get access to the supported file extensions for the validator, for doing some checks, which lived somewhere else, so I very lazily dumped the file extensions onto an object that I was processing in the test, just for test purposes, right? it'll be fine. This array happened to come one of our production code modules.

My simplified version of the production module:

```js
const supportedValidators = ['name'];
module.exports = {
    validators: () => {
        return supportedValidators.map((validator) => {
            // imports ./validators/name.js what name.js does is not important.
            return require(`./validators/${validator}.js`);
        })
    }
}
```

What's happening here is a function is exported which exposes other modules via a dynamic require statement. This dynamic require statement is `very important` to the memory leak and i'll come back to it.

> As an aside using require like this in the code is blocking, so it might not be the best thing to use. For more modern code we could use `import()` in ES Module code.

Now for the bad code, I had in my unit test:

```js
const {validators} = require("./validate");

const badFunction = () => {
    const myValidators = validators();
    myValidators.map((validator) => {
        // yeah i know, this is super bad.
        if(!validator.supportedExtensions) {
            validator.supportedExtensions = [];
        }
        // the code didn't do this exactly this is demo
        validator.supportedExtensions.push(".pdf");
    });
}
```

This code is terrible for so many reasons, but at the time I justified it to myself because it was `only for unit tests`.
In this context the `.push` always looks really bad, it is, and because of this will avoid doing such bad things in the future, but at the time the number of elements that could go into that array in the unit test was negligible, so I justified it to myself.
Unfortunately, `only for unit tests` ended up not being true, and here is my first learning from this experience:

> Any code that you write anywhere, including inside of unit tests, could be copied by any well meaning developer adapting the code for their use case.
This happened, and unfortunately the "just for test" code with the `supportedExtensions = []` and `.push(".pdf")` came along for the ride, even though it wasn't needed at all for the production use case.

# Why is this a memory leak?

So on the face of it if you were to look at the `myValidators.map` code it doesn't look like i'm holding any references to the `supportedExtensions` object once `badFunction` is finished. But that assumption ignores that the Array, or the contents of it, that `validators()` supplies could be retained in memory forever.

> Objects in Memory are available for Garbage collection when there are no references to the object anymore and nothing is holding on to those objects. This is a massive over-simplification, I'll link a great talk later in this article which describes it much better than I ever could.

Do you remember this line of code?
```js 
return require(`./validators/${validator}.js`)
```
Here a NodeJS module is being imported into the current scope, the important thing about NodeJs modules though is that, no matter how many times you import a module you always get the a reference to the same module object, so:

```js
const foo = require("./foo");
const foo2 = require("./foo2")

foo === foo2 // true
```

This means that even if we lose all references to the imported module, it wont be garbage collected. In this case, this is extremely problematic because `validator.supportedExtensions.push(".pdf");` will add a new entry to an array that lives on this module object, any time the function is called. Imagine if this was on an REST API call. Yikes.

A couple more learnings here:
- Mutating objects in array someone else passed to you is dangerous, you have no idea what references are held to that object, your modifications may never be garbage collected.
- If you do have to put bad non-production code in, put a massive comment around it warning future developers.
- Avoid changing objects you don't control.

On a somewhat related note to the learnings above Jake Archibald recently wrote about the risks of calling methods with potentially non-future proof parameters https://jakearchibald.com/2021/function-callback-risks/.


## Memory profiling and finding the problem code

When I first realised that we might have a Memory leak I first wanted to make sure I knew what tools where at my disposal,
I headed to YouTube and found this great video on the topic.

{%- youtube "hliOMEQRqf8" %}

One way to profile for memory leaks in NodeJS is to use the `--inspect` flag when running your process e.g. `node --inspect index.js`
This starts a remote debugging session by default on port 9229.
The best way that I find to hook into this is via the Chrome Developer Tools.
If you open the Developer Tools when you have a `node --inspect` process running you should notice a new Node logo, like the one shown below:
![Open dedicated DevTools for NodeJS](/images/nodejs-dev-tools.png)

When you activate this mode a new window will open which, one of the tabs in the new window is "Memory"
![Memory profiling options in NodeJS dedicated DevTools for NodeJS](/images/memory-profiling.png)

To try and find the issue I selected the option "Allocation instrumentation timeline", I then proceeded to run our application tests which had caused the original "OOMKilled" on our cluster. After these tests ran I stopped the instrumentation and proceeded to sort through the results.
I found that sorted by "Retained size" and then searching the largest allocated objects helped me find the problem.

Sure enough after filtering through a lot of noise I found something like this:

![Shows lots of memory allocated to the "supportedExtensions"](/images/leaked-memory.png)

Luckily for me, I know our codebase quite well and was able to identify the problem area based on the variable name of the large array and also the array contents, which is where to my shame I found my awful code being used inside of an API call.

## Memory profile in Kubernetes

Memory profiling in Kubernetes is quite similar to when you are running locally, you need to end up with a server on your machine exposing a debugging session.

Recommendations:
- Scale your deployment down to 1 replica.
- Edit your deployment so your NodeJS server sets the `--inspect` flag
- Disable liveness and readiness probes for the container, otherwise K8s may kill your session whilst debugging.
- Increase your memory limits and requests, profiling can take up to 2x more memory than usual.
- Locate the pod you want to debug and run `kubectl port-forward pod-name 9229` this will result in the same debugging session as earlier running on your machine, forwarded from the K8s cluster.

## Reproducing the memory leak with demo code

If you want to have a play reproducing the memory leak you could do this:

1. Create the following file: `validators/name.js` Can be empty not important what it does.
2. Create `validate.js`
```js
const supportedValidators = ['name'];
module.exports = {
    validators: () => {
        return supportedValidators.map((validator) => {
            return require(`./validators/${validator}.js`);
        })
    }
}
```
3. Create `bad-code.js`
```js
const {validators} = require("./validate");

const badFunction = () => {
    const myValidators = validators();
    myValidators.map((validator) => {
        if(!validator.supportedExtensions) {
            validator.supportedExtensions = [];
        }
        // the code didnt do this exactly this is demo
        validator.supportedExtensions.push(".pdf");
    });
}

let index = 0;

setInterval(() => {
    // even though theres no references to myValidators array
    // there is a memory leak with the .push
    badFunction();
    index++;
    console.log(`Running bad code cycle: ${index}`);
},0)
```
4. Run `node --inspect bad-code.js` You will need NodeJS installed https://nodejs.org.
5. Open Chrome developer tools, you should see the NodeJS logo which says "Open dedicated DevTools for NodeJS"
6. Run the profiling techniques as described in the previous section.

# Learnings

I learnt a lot through this experience.
- Avoid writing sloppy code, even if it is non-production.
- Mutating objects in array someone else passed to you is dangerous, you have no idea what references are held to that object, your modifications may never be garbage collected.
- Avoid changing objects you don't control.
- How to Memory profile in NodeJS

I hope this was a good read, if only to laugh at my terrible code, if you feel like reading more of my ramblings, please follow me on Twitter [@griffadev](https://twitter.com/griffadev).
