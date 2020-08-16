const { dest, src } = require("gulp");
const babel = require("gulp-babel");

const babelTask = () => {
  return src("./src/assets/*.js")
    .pipe(
      babel({
        plugins: ["bare-import-rewrite"],
      })
    )
        // weird but needed so that in our site node_modules is the same relative level to assets in src.
    .pipe(dest("dist/src/assets"));
};

module.exports = babelTask;
