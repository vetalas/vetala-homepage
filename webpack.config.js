const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const sassGlobImporter = require('node-sass-glob-importer');
const mergeJS = require('webpack-merge-and-include-globally');

module.exports = {
  entry: ['./src/index.js', './src/style.scss', './src/style-fallback.scss'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'libs/css/[name].css',
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader?-url'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function(loader) {
                return loader.resourcePath.indexOf('style.') > -1
                ? [require('autoprefixer')]
                : [require('autoprefixer'), require('postcss-css-variables'), require('postcss-calc')];
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                importer: sassGlobImporter()
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "templates/template.html"
    }),
    new mergeJS({
      files: {
        "ui.js": [
          'src/libs/js/util.js',
          'src/libs/js/components/**/*.js',
        ]
      }
    }),
  ]
};
