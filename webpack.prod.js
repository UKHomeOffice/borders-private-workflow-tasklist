const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');
const ProgressPlugin = require('progress-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const path = require('path');

const buildDirectory = path.join(__dirname, './dist');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const WebpackPwaManifest = require('webpack-pwa-manifest');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CompressionPlugin = require('compression-webpack-plugin');


module.exports = webpackMerge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    path.join(process.cwd(), './app/index.jsx'),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        main: {
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    new CleanWebpackPlugin([
      buildDirectory,
    ], {
      verbose: true,
      dry: false,
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
        safe: true,
      },
      canPrint: false,
    }),
    new HtmlWebpackPlugin({
      title: 'Caching',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new UglifyWebpackPlugin({
      sourceMap: true,
      cache: true,
      parallel: true,
      uglifyOptions: {
        mangle: true,
        output: {
          comments: false,
        },
      },
      exclude: [/\.min\.js$/gi],
    }),
    new ProgressPlugin(true),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new CopyWebpackPlugin([
      { from: 'server.js', to: '' },
    ]),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new OfflinePlugin({
      autoUpdate: 1000 * 60 * 2,
      ServiceWorker: {
        events: true,
      },
      relativePaths: false,
      publicPath: '/',
      excludes: ['server.js'],
      caches: {
        main: [':rest:'],
        additional: ['*.chunk.js'],
      },
      safeToUseOptionalCaches: true,
    }),
    new WebpackPwaManifest({
      name: 'COP UI',
      short_name: 'cop-private-ui',
      description: 'Central Operational Platform Private UI',
      background_color: '#fff',
      theme_color: '#1d8feb',
      inject: true,
      ios: true,
      icons: [
        {
          src: path.join(__dirname, 'node_modules/govuk-frontend/assets/images/govuk-opengraph-image.png'),
          size: '1200x630',
          type: 'image/png',
        },
      ],

    }),
  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },

});
