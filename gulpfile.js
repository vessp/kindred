var gulp = require('gulp')
var watch = require('gulp-watch')
var rename = require('gulp-rename')
var runSequence = require('run-sequence').use(gulp)
var shell = require('gulp-shell');
var util = require('gulp-util');

var browserify = require('browserify')
var babelify = require('babelify')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var watchify = require('watchify')

var sass = require('gulp-sass')

var autoprefix = require('gulp-autoprefixer')
var notify = require('gulp-notify')

// gulp.task('test-move-file', function() {
//     return gulp.src(['./readme.md'])
//         .pipe(rename(function(path) {
//             path.basename = 'bundle'
//             path.extname = '.md'
//         }))
//         .pipe(gulp.dest('./bin'))
// })

gulp.task('js', function() {
    var bundler = browserify('./app/app.js', { debug: true })
        .transform(babelify, { /* options */ })
    return bundler.bundle()
        .on('error', notify.onError(function (error) {
                return 'Error: ' + error.message
         }))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./bin'))
})

//if having issues add {"atomic_save": true} to sublime user settings
gulp.task('css', function() {
    return gulp.src('./app/scss/app.scss')
        .pipe(
            sass({
                includePaths: [
                    './app/scss',
                ],
                style: 'compressed',
                loadPath: []
            })
            .on('error', notify.onError(function (error) {
                return 'Error: ' + error.message
            }))
        )
        .pipe(autoprefix('last 2 version'))
        .pipe(rename(function(path) {
            path.basename = 'bundle'
            path.extname = '.css'
        }))
        .pipe(gulp.dest('./bin'))
})

gulp.task('watch', function() {
    watch('./app/**/*.js', function(files) {
        runSequence('js')
    })
    
    watch('./app/scss/**/*.scss', function(files) {
        runSequence('css')
    })

    return runSequence('js', 'css')
})

var electronPackager = require('electron-packager')
gulp.task('build', () => {
    let opts = {
        dir: '.', //dir of source
        out: './build',
        name: 'Kindred',
        'app-version': '0.01',
        overwrite: true,
        //icon
        // all: true,
        arch: 'x64', //ia32, x64, armv7l, all
        platform: 'win32', //linux, win32, darwin, mas, all
    }
    return electronPackager(opts, (err, appPath) => {
            if (err) {
                util.log(err)
            }
            else {
                util.log('Built', util.colors.cyan(opts.name), util.colors.magenta('v' + opts.appVersion))
                util.log('Packaged to: ');
                for (var i = 0; i < appPath.length; i++) {
                    util.log('            ', util.colors.cyan(appPath[i]));
                }
            }
        });
})

var electronInstaller = require('electron-winstaller')
gulp.task('build-installer', function() {
    resultPromise = electronInstaller.createWindowsInstaller({
        appDirectory: './build/Kindred-win32-x64',
        outputDirectory: './build/Kindred-installer-x64',
        authors: 'David Roodnick',
        exe: 'Kindred.exe',
        description: 'Kindred'
      });

    resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
    return resultPromise
})


gulp.task('start', shell.task([
    'npm install',
    'npm run start',
]))

gulp.task('start_dev', shell.task([
    // 'npm install',
    'npm run start_dev',
]))

gulp.task('default', ['watch', 'start'])
