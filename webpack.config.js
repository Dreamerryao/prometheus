const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
  entry:'./src/index.ts',
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
     rules: [
      {
        test:/\.ts$/,
        use:'ts-loader',
        /* [
          {
            loader:"babel-loader",
            options:{
              presets:[
                [
                  "@babel/preset-env",
                  {
                    targets:{
                      "chrome": "88"
                    },
                    "corejs": "3",
                    "useBuiltIns":"usage"
                  }
                ]
              ]
            }
          },
          "ts-loader",
        ], */
        exclude:/node-module/
      }
     ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:"./test/test.html"
    })
  ],
  resolve:{
    extensions:['.ts', '.js']
  },
  devServer: {
    static: {                               
      directory: path.join(__dirname, './'),  
      watch: true
    }
 }
}