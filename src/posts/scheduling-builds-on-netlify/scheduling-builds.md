---
title: Scheduled builds a for website on Netlify
description: Sometimes you might want to periodically build your website on Netlify, the answer isn't that straight forward and some tools have gotchas.
tags:
  - Netlify
  - GithubActions
  - CircleCI
  - ContinuousIntegration
series:
  title: Static sites with dynamic content
  order: 2
date: "2021-06-21"
hero:
  image: /images/circle-ci-build.png
  alt: "CircleCI scheduled build"
---

I recently launched a re-write of my brothers Guitar teaching business website: [cgguitar.co.uk](https://www.cgguitar.co.uk), during this rewrite I implemented a feature where I wanted to [fetch YouTube playlists at build time](https://griffa.dev/posts/adding-dynamic-content-from-an-api-to-a-static-website-at-build-time/).

To achieve my goals, I wanted to scheduled builds of my Netlify website periodically.
Netlify doesn't have this feature built in, however what Netlify does have is a 'webhook' which you can call trigger to your build.

In this post I offer two ways to trigger this build, using Github Actions or CircleCI. Using Github Actions can have a significant downside, depending on the use case, continue read to find more about that!

## Finding your build hook in Netlify

Login to Netlify and navigate to your site settings and local the "Build & deploy" section, your build hook will be in there.

![Netlify build hook](/images/netlify-build-hook.png)

You can test this out by making a curl request in your terminal, you should see it trigger your Netlify website build:

```bash
curl -X POST -d {} https://api.netlify.com/build_hooks/$NETLIFY_BUILD_HOOK_TOKEN
```

> Important: Ensure you keep `NETLIFY_BUILD_HOOK_TOKEN` secret, otherwise anyone can call your build and potentially cause you to go over your build quota.

## Can Github Actions do this?

Github actions let you perform continuous integration in Github, they seem like a perfect fit here...

In your Github repository, in the following folder `.github/workflows`, you could create:
{% raw %}

```yaml
name: Scheduled build
on:
  schedule:
    - cron: "00 15 * * *"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger our build webhook on Netlify
        run: curl -s -X POST "https://api.netlify.com/build_hooks/${TOKEN}"
        env:
          TOKEN: ${{ secrets.NETLIFY_BUILD_HOOK_TOKEN }}
```

{% endraw %}

The above configuration will run every day at around 15:00.

You will want to secure your `build_hook` token in a secret on Github.

I did this originally and thought job done right? Well, not quite.

> Github Actions are disabled on projects after 60 days if there is no activity on the repository, meaning bye bye scheduled builds.

The above limitation might be okay, depending on your use case, but for my case where I wanted to make sure I was fetching the latest videos from a YouTube playlist, this was no good because the website's code itself may not be updating very often, but there may be new videos added.

## Using CircleCI instead

One alternative to Github actions is to use CircleCI to do this instead, it has a generous free tier too so there should be no charge for this.

You can create a configuration like this:

- Create a folder in your Git repository called `.circleci`
- Create a file called `config.yml`

Populate the `config.yml` with something like the following (you can use a different image if you wish). This will build every day at 3PM.

```yaml
version: 2

defaults: &defaults
  machine:
    image: circleci/classic:201710-02
  steps:
    - run: curl -X POST -d {} https://api.netlify.com/build_hooks/$NETLIFY_BUILD_HOOK_TOKEN

jobs:
  docker:
    <<: *defaults

workflows:
  version: 2

  autobuild:
    triggers:
      - schedule:
          cron: "0 14 * * *"
          filters:
            branches:
              only:
                - main
    jobs:
      - docker
```

Now you can create a project in CircleCI and you should be able to test your build.
`NETLIFY_BUILD_HOOK_TOKEN` will need to be set as an environment variable, in a similar way to Github, in the setting of CircleCI for your project.

![CircleCI scheduled build](/images/circle-ci-build.png)

If you want to read more of my work, please follow me on Twitter [@griffadev](https://twitter.com/griffadev), or get me a [coffee](https://ko-fi.com/griffadev) if you feel like it ☕.
