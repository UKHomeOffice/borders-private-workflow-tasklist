const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const cssnano = require('cssnano');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// local imports
const common = require('./webpack.common.js');

const buildDirectory = path.join(__dirname, './dist');

module.exports = webpackMerge(common, {
  mode: 'production',
  devtool: false,
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    path.join(process.cwd(), './app/index.jsx'),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true }}],
        },
        canPrint: false,
      }),
      new TerserPlugin({
        terserOptions: {
          compress: {
            comparisons: false,
          },
          output: {
            comments: false,
            ascii_only: true,
          },
        },
      })
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
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
    }),
    new CopyWebpackPlugin([
      { from: 'server.js', to: '' },
    ]),
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
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ProgressPlugin(),
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
          src: path.join(__dirname, 'node_modules/govuk-frontend/govuk/assets/images/govuk-opengraph-image.png'),
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
