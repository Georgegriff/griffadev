const { imageOptimizer } = require("./imgopt");
const { JSDOM } = require("jsdom");
const path = require("path");
const distFolder = "dist";

const processImage = async (img, outputPath) => {
    const alt = img.getAttribute("alt");
    let src = img.getAttribute("src");
    const doc = img.ownerDocument;
    const div = doc.createElement("div");
    const fileSrc = path.resolve(__dirname, `../${distFolder}`) + src
    const imgTxt =  await imageOptimizer(fileSrc, {alt, ariaHidden: false})
    if(imgTxt) {
        div.innerHTML = imgTxt;
        img.parentElement.replaceChild(div.querySelector('picture'), img);
    }

}

const transformImages = async (rawContent, outputPath) => {
    let content = rawContent;
  
    if (outputPath && outputPath.endsWith(".html")) {
      const dom = new JSDOM(content);
      const images = [...dom.window.document.querySelectorAll("img")];
  
      if (images.length > 0) {
        await Promise.all(images.map((i) => processImage(i, outputPath)));
        content = dom.serialize();
      }
    }
  
    return content;
  };


module.exports = {
    initArguments: {},
    configFunction: async (eleventyConfig, pluginOptions = {}) => {
      eleventyConfig.addTransform("imgDim", transformImages);
    },
  };