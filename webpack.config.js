const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry:{
    index:'./src/index.ts',
    test:'./test/test.ts',
  },
  output:{
    filename:'src/[name].js',
    path:path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
     rules: [
      {
        test:/\.ts$/,
        use:'ts-loader',
        exclude:/node-module/
      }
     ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:"./test/test.html",
      chunks: ['index', 'test'],
      //选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。
      // 那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
      //chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
      inject: true,
      hash: true
    })
  ],
  resolve:{
    extensions:['.ts', '.js']
  },
  devServer: {
    open:true,
    port:'8080',
    static: {                               
      directory: path.join(__dirname, './'),  
      watch: true
    }
 }
}