'use strict';

var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  path = require('path'),
  srcPath = path.join(__dirname, 'src');

module.exports = {
  cache: true,
  entry: {
    module: path.join(srcPath, 'module.js'),
    common: ['react', 'react-router', 'alt', 'react-bootstrap', 'lodash', 'jquery', 'marked', 'classnames']
  },

  resolve: {
    root: srcPath,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src']
  },
  output: {
    path: path.join(__dirname, 'target'),
    publicPath: '/',
    filename: '[name].js',
    library: ['Example', '[name]'],
    pathInfo: true
  },

  module: {
    loaders: [
      {test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
      { test: /\.css$/,   loader: "style-loader!css-loader" },
     { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
     { test: /\.woff2$/,  loader: "url-loader?limit=10000&minetype=application/font-woff" },
     { test: /\.ttf$/,    loader: "file-loader" },
     { test: /\.eot$/,    loader: "file-loader" },
     { test: /\.svg$/,    loader: "file-loader" },
     { test: /\.png$/,    loader: "file-loader" },
     { test: /\.jpg$/,    loader: "file-loader" },
     {test: /\.less$/,    loader: "style!css!less"}
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new HtmlWebpackPlugin({
      inject: true,
      favicon:'./src/assets/images/favicon.png',
      template: 'src/index.html'
    }),
    new webpack.NoErrorsPlugin()
  ],

  debug: true,
   devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: "/target/",
    historyApiFallback: true
  }
};
