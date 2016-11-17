'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry:{
    "app":"./src/app",
    "editor": "./src/editor"
  },
  output: {
    path: path.join(__dirname, "./public/javascripts/"),
    filename: "[name].js",
    chunkFilename: "[id].js"
  },
  module: {
    loaders: [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {"presets": ["es2015", "stage-0"]}
    },{ test: /\.css$/, loader: "style!css" }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};