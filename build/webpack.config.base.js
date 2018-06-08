const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

// 判断是开发模式还是上线模式
const isDev = process.env.NODE_ENV === 'development'

// webpack的基本配置, 这部分代码无论是开发模式还是上线模式, 都是公用的
const config = {
  // 是作用于网页端(web)还是服务端(node)
  target: 'web',
  // 是开发模式(development)还是上线模式(production)
  mode: process.env.NODE_ENV,
  // 入口文件
  entry: [
    // 解决不同浏览器之间的js写法
    'babel-polyfill',
    // vue的入口文件
    path.join(__dirname, '../src/main.js')
  ],
  // 出口配置
  output: {
    // 打包出来的东西放在根目录的dist文件夹
    path: path.join(__dirname, '../dist')
  },
  // 优化配置
  resolve: {
    // 省略文件后缀名
    extensions: ['.vue', '.js', '.scss'],
    // 懒人路径
    alias: {
      'src': path.join(__dirname, '../src'),
      'components': path.join(__dirname, '../src/components'),
      'api': path.join(__dirname, '../src/api'),
      'common': path.join(__dirname, '../src/common'),
      'base': path.join(__dirname, '../src/base')
    }
  },
  // webpack编译不同文件类型的规则
  module: {
    rules: [
      {
        // 编译vue或者js文件时,使用eslint-loader
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        // 除了node_modules下的不编译
        exclude: /node_modules/,
        // 顺序: 在其他loader编译之前先使用eslint-loader编译, pre是之前, next是之后
        enforce: 'pre'
      },
      {
        // 编译vue文件时, 使用vue-loader
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        // 编译js文件时, 使用babel-loader, 帮助我们把ES6的语法变成浏览器可读的ES5
        test: /\.js$/,
        loader: 'babel-loader',
        // 除了node_modules下的不编译
        exclude: /node_modules/
      },
      {
        // 编译图片时, 使用url-loader
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        // 而编译图片也可以使用file-loader
        // file-loader的工作是: 帮我们图片文件改个名字, 然后复制到我们指定的文件夹
        // url-loader的工作是: 帮我们先判断我们图片是否大于下面limit的大小, 而这里limit的单位是B
        // 如果说小于, 就把我们图片变成base64位, 写到我们的js当中, 如果大于, 就直接改个名字, 然后复制到我们指定的文件夹
        // 所以url-loader依赖于file-loader, 但file-loader不依赖于url-loader
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        // 编译视频文件时, 使用url-loader
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        // 编译字体文件时, 使用url-loader
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    // vue-loader升级到15.2.2版本后, 会出现编译不了vue文件的错误
    // 而解决方案就是, 引入VueLoaderPlugin到webpack的配置里面
    new VueLoaderPlugin(),
    // 帮助我们生成index.html, 顺便把打包出来的js和css引入到index.html中
    new HtmlWebpackPlugin({
      // 我们可以指定index.html的模板
      template: path.join(__dirname, '../index.html')
    }),
    // 当我们vue或者react这些框架的时候, webpack推荐我们使用这个plugin
    // 用来帮助webpack去更好的识别是使用开发版本的vue还是上线版本的vue
    // 而开发版本的vue是有非常多的报错信息的, 而上线版本的vue是没有的, 体积会更小
    new webpack.DefinePlugin({
      'process.env': {
        // 这里一定要注意字符串的写法
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    })
  ]
}

module.exports = config
