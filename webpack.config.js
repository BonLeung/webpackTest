const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (env = {}) => {
  let plugins = [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app/views/index.html')
    })
  ]

  if (env.production) {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new ExtractTextPlugin('style.css'),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    )
  }

  return {
    entry: {
      app: './app/js/main.js'
    },
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['.js', '.vue']
    },
    module: {
      loaders: [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: path.resolve(__dirname, 'app'),
        options: {
          emitWarning: false
        }
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          cssModules: {
            localIdentName: '[path][name]----[local]---[hash:base64:5]',
            camelCase: true
          },
          loaders: env.production ? {
            css: ExtractTextPlugin.extract({
              use: 'css-loader!px2rem-loader?remUnit=75&remPrecision=8',
              fallback: 'vue-style-loader'
            }),
            scss: ExtractTextPlugin.extract({
              use: 'css-loader!px2rem-loader?remUnit=75&remPrecision=8!sass-loader',
              fallback: 'vue-style-loader'
            })
          } : {
            css: 'vue-style-loader!css-loader!px2rem-loader?remUnit=75&remPrecision=8',
            scss: 'vue-style-loader!css-loader!px2rem-loader?remUnit=75&remPrecision=8!sass-loader'
          }
        }
      }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }]
    },
    plugins,
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    }
  }
}
