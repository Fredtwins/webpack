const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    // 样式自动加浏览器前缀
    autoprefixer()
  ]
}

// 配置这个文件后, 还不能生效, 还需要在package.json 文件下配置 browserslist
