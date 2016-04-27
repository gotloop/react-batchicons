const gulp = require('gulp');
const rename = require('gulp-rename');
const size = require('gulp-size');
const svgmin = require('gulp-svgmin');
const util = require('gulp-util');
const cheerio = require('gulp-cheerio');
const Stream = require('stream');
const Readable = Stream.Readable;
const Path = require('path');
const fs = require('fs');

const PATHS = {
    js: {
        src: Path.join(__dirname, 'src/'),
        dest: Path.join(__dirname, 'dist/')
    },
    svg: {
        src: Path.join(__dirname, 'Batch/SVG/'),
        dest: Path.join(__dirname, 'src/svg/')
    }
};
//
function toJSON(fileName){
  return util.buffer((err, files)=>{
      //extract jsonValue from files array.
        const icons = files.map((file)=>file.jsonValue);
        fs.writeFile(fileName, JSON.stringify(icons));
    });
}
//copy SVG files from Batch (git submodule) to temp directory.
gulp.task('optimize-svg',
    () =>
        gulp.src(PATHS.svg.src + '**/*.svg')
            .pipe(svgmin())
            .pipe(gulp.dest(PATHS.svg.dest))
);
//extract svg path from optimized files.
gulp.task('extract-path',
    () => {
        //const icons = [];
        gulp.src(PATHS.svg.dest + '**/*.svg')
            .pipe(cheerio({
                run: function ($, file, done) {
                    //extract icon name from file path.
                    var name = file.path.substring(
                        file.path.lastIndexOf('\\') + 1,
                        file.path.lastIndexOf('.')
                    );
                    //extract svg path from xml element.
                    var path = $('path').attr("d");
                    //store in the file
                    file.jsonValue = {name, path};
                    done();
                }
            }))
            .pipe(util.buffer((err, files)=>{
                //extract jsonValue from files array.
                const icons = files.map((file)=>file.jsonValue);
                fs.writeFile('./src/paths.json', JSON.stringify(icons));
            }));

    }
);