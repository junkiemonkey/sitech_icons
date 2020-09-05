const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const pages = ['index'];

module.exports = {
  entry: {
    main: './src/scss/styles.scss',
    'icons-1': './src/scss/components/icon-1.scss',
    'icons-2': './src/scss/components/icon-2.scss',
    'icons-3': './src/scss/components/icon-3.scss',
    'icons-4': './src/scss/components/icon-4.scss',
    'icons-5': './src/scss/components/icon-5.scss',
    'icons-6': './src/scss/components/icon-6.scss',
    'icons-7': './src/scss/components/icon-7.scss',
  },
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendors',
          enforce: true
        }
      }
    }
  },
  module: {
    rules:  [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            }
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$|njk/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              attributes: {
                root: path.resolve(__dirname, 'src/images/')
              }
            }
          },
          {
            loader: 'nunjucks-html-loader',
            options : {
              searchPaths: ['./src/views'],
              pretty: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ...pages.map(page => (
      new HtmlWebpackPlugin({
        filename: `${page}.html`,
        inject: 'body',
        hash: true,
        minify: false,
        template: `nunjucks-html-loader!./src/views/${page}.njk`,
      })
    )),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "[name].css"
    })
  ]
}
