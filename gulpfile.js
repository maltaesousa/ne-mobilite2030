const { Transform } = require('stream');
const fs = require('fs');
const gulp = require('gulp');
const matter = require('gray-matter');
const mustache = require('mustache');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer').default;

const site = {
  title: 'NE Mobilité 2030'
};

// Front-matter YAML + template mustache (les pages sont en HTML)
function renderPage(template) {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (!file.isBuffer()) return cb(null, file);
      try {
        const { data, content } = matter(String(file.contents));
        const html = mustache.render(template, {
          page: data,
          site: site,
          content
        });
        file.contents = Buffer.from(html);
        cb(null, file);
      } catch (err) {
        cb(err);
      }
    }
  });
}

gulp.task('html', function() {
  const template = fs.readFileSync('src/templates/template.html', 'utf8');

  return gulp.src('src/pages/**/*.html')
    .pipe(renderPage(template))
    .pipe(gulp.dest('dist/'));
});

// Navigateurs cibles : champ "browserslist" du package.json
gulp.task('less', function() {
  return gulp.src('src/less/main.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('src/less/*.less', gulp.series('less'));
});

// Copy static resources
gulp.task('static', function () {
  return gulp.src('src/static/**/*', {encoding: false})
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.series('static', 'html', 'less'));
