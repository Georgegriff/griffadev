function calculateAspectRatioFit(srcWidth, srcHeight, desiredWidth) {
    const aspectRatio =  srcHeight /  srcWidth;
    const height = desiredWidth * aspectRatio;

    return { width: desiredWidth, height};
}

function pixelate(img, { pixelation = 1, scaleFactor = 1, totalColors = 16 }) {
    // loaded in index.md
    const imageQ = window['image-q'];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaledWidth = (img.width) * scaleFactor;
    const {width, height} = calculateAspectRatioFit(img.width, img.height, scaledWidth);
 
    canvas.width = width;
    canvas.height = height;
    const fw = (width / pixelation) | 0,
        fh = (height / pixelation) | 0;


    ctx.imageSmoothingEnabled =
        ctx.mozImageSmoothingEnabled =
        ctx.msImageSmoothingEnabled =
        ctx.webkitImageSmoothingEnabled = false;


    ctx.drawImage(img, 0, 0, fw, fh);

    ctx.drawImage(canvas, 0, 0, fw, fh, 0, 0, width, height);
    const pointContainer = imageQ.utils.PointContainer.fromHTMLCanvasElement(canvas);
    const palette = imageQ.buildPaletteSync([pointContainer], { 
        colorDistanceFormula: 'euclidean', // optional
        paletteQuantization: 'neuquant', // optional
        colors: totalColors || 16
    });
    const outPointContainer = imageQ.applyPaletteSync(pointContainer, palette);
    return transformData({width: outPointContainer.getWidth(), height: outPointContainer.getHeight(), data: outPointContainer.toUint8Array(),
    imgWidth: img.width,  imgHeight: img.height});

}

function RGBAToHexA(r,g,b,a) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = Math.round(a * 255).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;
  
    return "#" + r + g + b + a;
}

function transformData(imgData) {
    const output = [];
    const { width, height, data: pixels } = imgData;
    const size = width * height;
    const colorMap = new Map();
    for (let p = 0; p < size; p++) {
        const red = pixels[p * 4];
        const green = pixels[p * 4 + 1];
        const blue = pixels[p * 4 + 2];
        const alpha = pixels[p * 4 + 3] / 255;
        const color = `rgba(${red},${green},${blue},${alpha})`;
        const y = parseInt(p / width, 10);
        const x = p - y * width;
        const hex = RGBAToHexA(red, green, blue, alpha)

        let foundColor = [...colorMap.values()].find((v) => v.color === color);
        if(!foundColor) {
            const currentColor = `--pixel-img-color-${colorMap.size}`;
            foundColor = {hex, var:currentColor, color, css: `var(${currentColor}, ${color})`};
            colorMap.set(color, foundColor);
        }

        output.push({ x, y,  ...foundColor})
    }
    return { width, height, data: output, colorMap, imgHeight: imgData.imgHeight,  imgWidth: imgData.imgWidth   };
}

export function getPixelData(src, pixelation) {

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.crossOrigin = "Anonymous";

        img.onload = function () {

            img.style.display = 'none';
            resolve(pixelate(img, pixelation));
        };
        img.onerror = (e) => {
            reject(e)
        }
    });

}