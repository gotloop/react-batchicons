const gulp = require('gulp');
const rename = require('gulp-rename');
const size = require('gulp-size');
const svgmin = require('gulp-svgmin');
const util = require('gulp-util');
const cheerio = require('gulp-cheerio');
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
//extract svg path from optimized files.
gulp.task('default',
    () => {
        //const icons = [];
        gulp.src(PATHS.svg.src + '**/*.svg')
            .pipe(svgmin())
            .pipe(cheerio({
                run: function ($, file, done) {
                    //extract icon name from file path.
                    var name = file.path.substring(
                        file.path.lastIndexOf('\\') + 1,
                        file.path.lastIndexOf('.')
                    );
                    //extract svg path from xml element.
                    var path = $('path').attr("d") || "";
                    //store in the file
                    util.log(`extracted path for file ${name} : ${path !== ""}`);
                    file.jsonValue = {name, path};
                    done();
                }
            }))
            .pipe(util.buffer((err, files)=>{
                //extract jsonValue from files array.
                const paths = {};
                files.forEach(
                    (file)=>{
                        paths[file.jsonValue.name] = file.jsonValue.path;
                    }
                );
                fs.writeFile('./src/paths.json', JSON.stringify(paths));
            }));

    }
);