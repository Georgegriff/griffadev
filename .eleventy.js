const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownitmisize = require("markdown-it-imsize");
const { minify } = require("terser");

const siteMeta = require("./src/_data/metadata.json");

module.exports = (eleventyConfig) => {

    /* Markdown Overrides */
    let markdownLibrary = markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    }).use(markdownItAnchor, {
      permalink: true,
      permalinkClass: "direct-link",
      permalinkSymbol: "<copy-link></copy-link>"
    }).use(markdownitmisize);

    eleventyConfig.addPlugin(pluginSyntaxHighlight);

     // Remember old renderer, if overridden, or proxy to default renderer
     const defaultCodeRender = markdownLibrary.renderer.rules.fence || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    markdownLibrary.renderer.rules.fence = (...args) => {
      const [tokens, idx, options, env, self] = args;
      env.parsedDemoIds = env.parsedDemoIds || [];
      const parsedDemoIds = env.parsedDemoIds;
      const token = tokens[idx];

      const getDataFromInfo = (token) => {
        const info = token.info || '';
        let lang = info.substr(0,info.indexOf(' ')); 
        let id = info.substr(info.indexOf(' ')+1);
        if(!lang) {
          lang = id;
          id = '';
        }
        return {id, lang};
      }

      const wrapCode = (lang, index) => {
        const renderedCode = defaultCodeRender(tokens, index, options, env, self);
        const languageKey = lang.toLowerCase() === "javascript" ? "js" : lang.toLowerCase();
        return `<div contenteditable slot="${languageKey}" data-language="${languageKey}">${renderedCode}</div>`
      };
      let dataObj = getDataFromInfo(token);
      if (dataObj && dataObj.id) {
          if(parsedDemoIds.includes(dataObj.id)) {
            return '';
          }
          let matchingTokens = [wrapCode(dataObj.lang, idx)];
          for (let i = idx+1; i < tokens.length; i++) {
            if(tokens[i].type !== "fence") {
              continue;
            }
            const {id, lang} = getDataFromInfo(tokens[i]);
            if(id &&id === dataObj.id) {
              matchingTokens.push(wrapCode(lang, i));
            }
          }
          parsedDemoIds.push(dataObj.id);
          return `
          <live-demo id=${dataObj.id}>
          ${matchingTokens.join("")}</live-demo>`;
        // find all code with matching id
      } else {
        return defaultCodeRender(...args);
      }
    }

    markdownLibrary.renderer.rules.image = (tokens) => {
      const token = tokens[0];
      const attrs = token.attrs.reduce((attrs, [key, value])=> {
        attrs[key] = value;
        return attrs;
      }, {})
      return String.raw`<figure>
        <div class="img-wrap"><img width="${attrs.width}" height="${attrs.height || ""}" src="${attrs.src}" alt="${attrs.alt || token.content}">
        <figcaption>${attrs.alt|| attrs.title || token.content}</figcaption>
      </div>
      </figure>`
    }

    // Remember old renderer, if overridden, or proxy to default renderer
    const defaultLinkRender = markdownLibrary.renderer.rules.link_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    markdownLibrary.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      // If you are sure other plugins can't add `target` - drop check below
      const link = tokens[idx];
      var aIndex = link.attrIndex('target');
      const hrefIndex = link.attrIndex('href');
      if(hrefIndex > -1) {
        const href = link.attrs[hrefIndex][1];
        const isRelativeUrl= href && (href.startsWith("/") || href.startsWith("#") || href.startsWith(siteMeta.url));
        if (isRelativeUrl) {
          return defaultLinkRender(tokens, idx, options, env, self);
        }
      }
      if (aIndex < 0) {
        link.attrPush(['target', '_blank']); // add new attribute
      } else {
        link.attrs[aIndex][1] = '_blank';    // replace value of existing attr
      }

      // pass token to default renderer.
      return defaultLinkRender(tokens, idx, options, env, self);
    };

    eleventyConfig.setLibrary("md", markdownLibrary);
  
  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
    open: true,
  });
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({"src/posts/**/images/*.*": "images"});

  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPlugin(pluginRss);
  //eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setLiquidOptions({
    dynamicPartials: true
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
    code,
    callback
  ) {
    try {
      if(process.env.NODE_ENV === 'production') {
        const minified = await minify(code);
        callback(null, minified.code);
      } else {
        callback(null, code);
      }
    } catch (err) {
      console.error("Terser error: ", err);
      // Fail gracefully.
      callback(null, code);
    }
  });

  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });
  return {
      templateFormats: [
        "md",
        "njk",
        "html",
        "liquid"
    ],
    dir: {
      input: "src",
      output: "dist"
    },
  };
};
