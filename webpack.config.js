'use strict';
var webpack = require('webpack');

module.exports = {
    entry: "./src/app.js",
    output: {
      path: __dirname,
      filename: "./public/javascripts/bundle.js"
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: "style!css" }
      ]
    }
};