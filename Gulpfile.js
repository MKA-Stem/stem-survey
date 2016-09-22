"use strict";
let gulp  = require("gulp");
let sass  = require("gulp-sass");
let pug   = require("gulp-pug");
let clean = require("gulp-clean");
let htmlMin = require("gulp-htmlmin");
let cleanCss = require("gulp-clean-css");
let moduleImporter = require("sass-module-importer");
let autoprefixer = require("gulp-autoprefixer");

gulp.task("clean", function(){
    return gulp.src("static", {read:false})
        .pipe(clean());
});

gulp.task("sass", function() {
    return gulp.src("src/**/*.scss")
        .pipe(sass({
            importer: moduleImporter()
        }))
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest("./static", {overwrite:true}));
});

gulp.task("pug", function(){
    return gulp.src("src/**/*.pug")
        .pipe(pug())
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(gulp.dest("./static"), {overwrite:true});
});

gulp.task("js", function(){
    return gulp.src("src/**/*.js")
        .pipe(gulp.dest("./static"));
});

gulp.task("build", [ "sass", "pug", "js"]);

gulp.task("watch", ["build"], function(){
    gulp.watch("**/*", ["build"]);
});

gulp.task("run", ["build"], function(){
    let app = require("./app"); // eslint-disable-line no-unused-vars
});