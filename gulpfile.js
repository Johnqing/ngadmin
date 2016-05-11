var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var sequence = require('run-sequence');
var gulpNgDirective = require('gulp-ng-directive');
var ngRevTemp = require('gulp-ng-replace-directive-template');

var proStaticDir = path.join(__dirname, 'public/src');

var config = {
    output: path.join(__dirname, 'public/build'),
};

var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

// 生产
gulp.task("webpack:prod", function(callback) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
    function chunkList(){
        this.plugin('done', function(stats) {
            // 获取文件列表
            var filemaps = stats.toJson();
            var filemapsStr = JSON.stringify(filemaps.assetsByChunkName);
            // 生成编译文件的maps
            fs.writeFileSync(path.join(__dirname, 'public/build', 'assets.json'), filemapsStr);
        });
    }

    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.output = {
        path: path.join(__dirname, 'public/build/'),
        filename: '[name].js'
    };
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("prod")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        chunkList,
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['angular', '$super', '$', 'exports', 'require']
            },
            compress: {
                warnings: false
            }
        })
    );

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err)
            return console.log(err);
        console.log(stats.toString({
            colors: true
        }));
        callback();
    });
});
gulp.task('prod', function (cb) {
    sequence(
        ['webpack:prod'],
        cb)
});