const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEBUG = process.env.NODE_ENV === 'debug';
const DEVELOPMENT = process.env.NODE_ENV === 'development';

// >> Target Structure <<
// > Root App
const APP_FOLDER = path.resolve(__dirname, './app');
// > Dist
const DIST_FOLDER = path.resolve(__dirname, './dist');
const DIST_FOLDER_STYLE = path.resolve(DIST_FOLDER, './style');

const DIST_FILE_CSS_BUNDLE_NAME = 'bundle.css';
const DIST_FILE_CSS_BUNDLE = `style/${DIST_FILE_CSS_BUNDLE_NAME}`;
// > Src
const SRC_FOLDER = path.resolve(APP_FOLDER, './src');
const SRC_FILE_JS_APP = path.resolve(SRC_FOLDER, './js/index');

let plugins = [
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // > Minimize JS
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    mangle: false,
    compress: {
      warnings: false,
    },
    minimize: true,
  }),
  // > CSS Bundle
  new ExtractTextPlugin({
    filename: DIST_FILE_CSS_BUNDLE,
    disable: false,
    allChunks: true,
  }),
  // > Minimize CSS
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /DIST_FILE_CSS_BUNDLE_NAME/,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      discardComments: { removeAll: true },
    },
    canPrint: true,
  }),
  new CopyWebpackPlugin([
    { from: './app/src/images', to: path.resolve(DIST_FOLDER, './images') },
  ], {
    copyUnmodified: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['common', 'vendor'],
    minChunks: 2,
  }),
  new HtmlWebpackPlugin({
    template: 'app/index.ejs',
    favicon: 'app/src/images/favicon.ico',
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
];

if (DEBUG) {
  plugins = [
    new webpack.DefinePlugin({
      __DEV__: true,
      __HOST__: 'http://localhost:7070',
      // 'process.env': {
      //   API_URL: JSON.stringify('URL'),
      // },
    }),
    // > Configure CSS Bundle file
    new ExtractTextPlugin({
      filename: DIST_FILE_CSS_BUNDLE,
      disable: false,
      allChunks: true,
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          formatter: require('eslint-formatter-pretty'),
        },
      },
    }),
    new CopyWebpackPlugin([
      { from: './app/src/images', to: path.resolve(DIST_FOLDER, './images') },
    ], {
      copyUnmodified: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common', 'vendor'],
      minChunks: 2,
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.ejs',
      favicon: 'app/src/images/favicon.ico',
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
  ];
}

if (DEVELOPMENT) {
  plugins = [
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // > CSS Bundle
    new ExtractTextPlugin({
      filename: DIST_FILE_CSS_BUNDLE,
      disable: false,
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      { from: './app/src/images', to: path.resolve(DIST_FOLDER, './images') },
    ], {
      copyUnmodified: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common', 'vendor'],
      minChunks: 2,
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.ejs',
      favicon: 'app/src/images/favicon.ico',
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
  ];
}

module.exports = {
	// > JS Input / Output
  entry: {
    app: [SRC_FILE_JS_APP],
    vendor: [
      // LIST OF VENDORS
    ],
  },
  output: {
    path: DIST_FOLDER,
    publicPath: '/',
    filename: '[name].[hash].bundle.js',
    sourceMapFilename: 'sourcemaps/[file].map',
  },
  // > Module Folders (packages and extensions)
  resolve: {
    modules: ['node_modules', APP_FOLDER],
    extensions: ['.js', '.json', '.css', '.scss'],
    descriptionFiles: ['package.json'],
  },
  // > Module Handles
  module: {
    rules: [
      // > ESLINT
      {
        enforce: 'pre',
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
      },
      // > JS / JSX
      {
        test: /\.(js|jsx)?$/,
        loader: 'babel-loader',
        include: [APP_FOLDER],
        exclude: /(node_modules)/,
        options: {
          presets: ['env', 'stage-2'],
        },
      },
      // > CSS / SCSS
      {
        test: /\.(css|scss)?$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader/url!file-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          }, 'sass-loader'],
          publicPath: DIST_FOLDER_STYLE,
        }),
      },
      // > Favicon
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      // > handlebars
      {
        test: /\.(handlebars|hbs)$/,
        loader: "handlebars-loader",
      },
    ], // rules
  }, // module
  devtool: DEBUG || DEVELOPMENT ? 'source-map' : '',
  context: __dirname,
  target: 'web',
  plugins,
  cache: false,
  watchOptions: {
    aggregateTimeout: 1000,
    poll: true,
  },
  devServer: {
    contentBase: APP_FOLDER,
    compress: true,
    historyApiFallback: true,
    inline: true,
    port: 7070,
  },
};
