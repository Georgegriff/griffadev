const { dest, src } = require("gulp");
const babel = require("gulp-babel");

const babelTask = () => {
  return src("./src/components/*.js")
    .pipe(
      babel({
        plugins: ["bare-import-rewrite"],
      })
    )
    .pipe(dest("dist"));
};

module.exports = babelTask;
