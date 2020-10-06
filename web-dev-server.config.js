// npm start -> concurrently \"npx gulp watch\" \"npx eleventy --watch\" \"es-dev-server\"
const path = require("path");
const fs = require("fs").promises;
const URL = require("url").URL;
/**
 *
 * Check if asset lives in 11ty dist folder, if not serve from root folder.
 */
const serve11tyAssets = ({dist = "_site"} = {}) => {
    return async (context, next) => {
        // is the request for a html file?
        const pathName = new URL(`https://whatever.com${context.url}`).pathname;
        const url = pathName.endsWith("/") ? `${pathName}index.html` : pathName;
        try {
            const stats = await fs.stat(path.join(dist, url));
            if (stats.isFile()) {
                context.url = `/${dist}${pathName}`
            }
            return next();
        } catch  {
            return next();
        }
    }
}
module.exports = {
  port: 8081,
  watch: true,
  rootDir: ".",
  middleware: [
      serve11tyAssets({dist: "dist"})
    ],
  nodeResolve: true
};
