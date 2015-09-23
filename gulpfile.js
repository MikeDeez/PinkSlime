var gulp         = require('gulp');                   	          // Gulp
var clone        = require('gulp-clone');                        // used to fork a stream
var rename       = require('gulp-rename');                      // rename files in a stream
var stylus       = require('gulp-stylus');                     // turn stylus code into css
var plumber      = require('gulp-plumber');                   // handle errors
var beautify     = require('gulp-cssbeautify');    	   	     // make files human readable
var sourcemap    = require('gulp-sourcemaps');    	  	    // write sourcemaps
var minifycss    = require('gulp-minify-css');  	 	   // minify css code
var autoprefix   = require('gulp-autoprefixer');		  // prefix any css with low support
var combinemq    = require('gulp-combine-media-queries') // Adds Media Queries to the bottom

var paths = {
	stylus: ['assets/styl/style.styl'],
	output: 'assets/css/'
}

var plumberOpts = {
	errorHandler: notify.onError("Error: <%= error.message %>")
}

gulp.task('css', function(){
	// prepare css code
	var stream = gulp.src('assets/styl/style.styl')   	// grab our stylus file
		.pipe(plumber())                               // stop syntax errors crashing the watch
		.pipe(sourcemap.init())                       // get ready to write a sourcemap
		.pipe(stylus())                              // turn the stylus into css
		.pipe(sourcemap.write())                    // write the sourcemap
		.pipe(autoprefix('last 2 versions'));      // autoprefix the css code
	
	// make style.css
	stream.pipe(clone())                               // make a copy of the stream up to autoprefix
		.pipe(beautify())                             // make css really readable
		.pipe(gulp.dest('assets/css/'));             // save it into the dist folder
	
	// make style.min.css
	stream.pipe(clone())                              // make a copy of the stream up to autoprefix
		.pipe(minifycss())                           // minify it (removes the sourcemap)
		.pipe(sourcemap.write())                    // write the sourcemap
		.pipe(rename('style.min.css'))             // add .min to the filename
		.pipe(gulp.dest('assets/css/'));          // save it into the dist folder
	
	return stream;
});

gulp.task('watch', ['css'], function(){
	gulp.watch(['assets/styl/style.styl'], ['css']);   // watch for changes and run the css task
});

gulp.task('default', ['css']);