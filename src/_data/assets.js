module.exports = {
    getModule: (assetName) => {
        let modulePath = assetName;
        if (process.env.NODE_ENV === "production") {
            const assets = require("../_includes/manifest.json");
            modulePath = assets[assetName];
            if(!modulePath) {
              throw new Error(`error with getAsset, ${assetName} does not exist in manifest.json`);
            }
        }
        return `<script type="module" src="${modulePath}"></script>`
    }
}