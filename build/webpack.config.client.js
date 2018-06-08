const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const baseConfig = require('./webpack.config.base')

// 判断是开发模式还是上线模式
const isDev = process.env.NODE_ENV === 'development'

let config

// 通过判断, 去生成不同的webpack代码
if (isDev) {
  // 开发时候需要添加的webpack代码
  config = webpackMerge(baseConfig, {
    // 调试代码时, 不要给我们看到是编译后的代码, 而是webpack编译前的代码
    // veu-cli默认使用的是 #eval-source-map
    // #eval-source-map: 会让vue调试的代码更加详细, 定位更加准确, 缺点是 编译效率会慢一些
    // #cheap-module-eval-source-map: 会让vue调试的代码没有那么详细, 定位也没有那么准确,
    // 但是这个不准确的跨度也就一两行, 最重要的是编译效率会快点
    devtool: 'cheap-module-eval-source-map',
    output: {
      // 定义开发模式时, 出口文件的文件名, 因为是开发模式, 所以并不需要hash值
      filename: 'app.js',
      // 定义出口时, 静态资源的文件路径
      publicPath: '/'
    },
    module: {
      rules: [
        {
          // 开发模式下, 编译scss文件的配置
          test: /\.scss$/,
          // 使用use就是我们需要使用多个loader, 而使用多个loader时
          // 它的编译顺序是从自下往上的
          use: [
            // 最后使用style-loader, 把编译好的css通过style标签插入到我们的index.html中
            'style-loader',
            // 过滤好样式后, 使用css-loader, 把它变成可以使用的css
            'css-loader',
            {
              // 通过postcss-loader来帮助我们过滤css
              // 比如说需要过滤某些样式是要加浏览器前缀的, 而这个自动加浏览器前缀的功能
              // 是要通过配置我们根目录下的postcss.config.js
              loader: 'postcss-loader',
              options: {
                // 因为sass-loader编译完成后, 会生成一个sourceMap文件, 而这个文件是给我们css-loader读取的
                // sourceMap文件的作用是, 是告诉css-loader, 按照其里面定义的规则来把scss样式不编译成css
                // 而这里设置为true, 意思是: 如果sass-loader生成了sourceMap文件, postcss-loader就不用生成了, 直接用就可以了
                sourceMap: true
              }
            },
            // 先通过sass-loader编译scss文件
            'sass-loader'
          ]
        }
      ]
    },
    // 开发模式下, 需要启动一个本地服务器, 要使用者配置, 必须安装webpack-dev-server插件
    devServer: {
      // 端口
      port: '3000',
      // Ip
      // 如果使用localhost, 是不可以通过本地Ip来读取页面的
      // 而是用0.0.0.0的话, 就可以通过本地Ip来读取页面
      host: '0.0.0.0',
      // 当我们代码出错时, 直接在页面上出现黑色的错误提醒遮罩
      overlay: {
        errors: true
      },
      // 启用我们的热更替功能, 就是修改样式或文字时, 不刷新页面
      // 这个需要配合我们下面的 webpack.HotModuleReplacementPlugin 使用
      hot: true,
      // 当我们使用history路由的时候, 刷新页面找不到时, 自动重定向回来/index.html
      // 而 这里的 / 是和我们 output.publicPath是一致, 否则报错
      historyApiFallback: {
        index: '/index.html'
      }
    },
    plugins: [
      // 配置 devServer.hot 热更替功能 使用的插件
      new webpack.HotModuleReplacementPlugin()
    ]
  })
} else {
  // 上线模式的webpack配置
  config = webpackMerge(baseConfig, {
    output: {
      // 上线模式的出口文件名是需要打包在static文件夹下的js文件夹
      // 而且名字需要使用hash值, 这里使用chunkhash就是通过文件内容的不同生成hash值
      // 这样可以方便我们使用缓存
      filename: 'static/js/[name].[chunkhash:7].js',
      // 上线模式的静态资源文件路径, 这里配置的路径, 一定是打包后, 与放进的服务器的文件夹路径一致, 否则会找不到静态资源文件
      publicPath: '/'
    },
    module: {
      rules: [
        {
          // 上线模式的scss配置
          test: /\.scss$/,
          use: [
            // 与开发模式相比, 由于我们需要使用浏览器缓存, 所以不在往index.html插入style标签
            // 而是把每个组件的css都分离出来
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      // 帮助我们去生成文件名
      new webpack.NamedChunksPlugin(),
      // 分离出来的css文件配置
      new MiniCssExtractPlugin({
        // 分离到static文件夹下的css文件夹
        // 使用contenthash也是根据文件内容生成hash
        filename: 'static/css/[contenthash:7].css'
      }),
      // 帮助我们辅助static文件夹下的静态资源
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, '../static'),
          to: 'static'
        }
      ])
    ],
    // 上线优化配置
    optimization: {
      minimizer: [
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin({}),
        // 压缩js
        new UglifyjsWebpackPlugin({
          // 是否使用缓存
          cache: true,
          // 是否优化压缩后的js
          parallel: true
        })
      ],
      // 把我们js的业务代码和插件分离出来
      splitChunks: {
        // all的意思是, 无论是异步插件还是同步的插件, 都分离出来
        chunks: 'all'
      },
      // 分离我们部分webpack模块的代码
      runtimeChunk: true
    }
  })
}

module.exports = config
