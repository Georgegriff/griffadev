const { promisify } = require("util");
const sizeOf = promisify(require("image-size"));
const path = require('path');
const sharp = require('sharp');
const Image = require("@11ty/eleventy-img");


const imageOptimizer = async (src, {alt, ariaHidden, urlOnly, widths = [320, 640, 960, 1200, 1800, 2400]}) => {
    if(src.endsWith(".gif")) {
        return;
    }
    const formats = src.endsWith('svg') ? ["svg"] : ["jpeg", "webp"];
    const imgPath = src;
    let stats = await Image(imgPath, {
      widths,
      urlPath: "/images/",
      outputDir: "./dist/images/",
    });
    if(urlOnly && Object.keys(stats).length) {
      const format = Object.keys(stats)[0];
      const sizes = stats[format];
      return sizes[sizes.length - 1].url;
    }
    let placeholderStyle = ''
    const hasJpg = stats["jpeg"]
    if(hasJpg && hasJpg.length && !src.startsWith('http')) {
      let lowestSrc = hasJpg[0];
      const dimensions = await sizeOf(imgPath);
      const placeholder = await sharp(lowestSrc.outputPath)
      .resize({ fit: sharp.fit.inside })
      .blur()
      .toBuffer();
       const base64Placeholder = `data:image/png;base64,${placeholder.toString("base64")}`;
      const containSize = `min(var(--main-width), ${dimensions.width}px) min(calc(var(--main-width) * ${dimensions.height / dimensions.width}), ${dimensions.height}px)`;
      placeholderStyle = `background-position:center;background-size:cover;background-image:url('${base64Placeholder}')`
    }
    const imgHtml = Image.generateHTML(stats,  {
        alt,
        loading: "lazy",
        decoding: "async",
        "aria-hidden": ariaHidden ? "true" : "false",
        style: placeholderStyle,
        sizes:" (min-width: 960px) 720px, 100vw"
      }, {
        whitespaceMode: "inline"
      })
  
      return imgHtml;
  }

module.exports.imageOptimizer = imageOptimizer;