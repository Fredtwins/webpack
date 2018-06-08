// 静态资源打包上线路径
// 结论:
// 1. history路由打包必须放在根目录, 所以静态资源目录必须写 /static
// 2. hash路由打包放根目录, 静态资源目录可以写 /static 或 static
// 3. hash路由打包不放根目录, 静态资源目录必须写 static
export const Static = '/static'
