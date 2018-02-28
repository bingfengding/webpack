//更改默认的配置文件为命令行内输入  webpack --config 新配置文件名
//定义可以直接到npm的配置文件内进行定义
//引用插件
const htmlWebpackPlugin = require("html-webpack-plugin");//npm安装
const webpack = require("webpack");//访问内置插件
const path = require('path');
//npm安装html-webpack-inline-source-plugin 这个插件。是html-webpack-plugin的扩展插件,把页面src引入文件的方式，改成用script标签嵌入的方式，减少http请求( 提高加载性能）
const htmlWebpackInlineSourcePlugin =  require("html-webpack-inline-source-plugin");

const config = {
    entry: {
        index:["./src/js/index.js"],
        demo:["./src/js/demo.js"],
        a:["./src/js/a.js"],
        b:["./src/js/b.js","./src/js/c.js"],
    },
    output: {
        path: path.resolve(__dirname, './dist'),//指向了dist目录
        publicPath:"www.mydarksea.com",//这个方便上线使用的，路径会替换为对应网址的
        //设定了让js输出到js文件夹啊内
        filename: "js/[name]-[hash].bundle.js",//可以用占位符区分不同输出，[name]表示的是打包的文件名，[hash]打包时候的hash，[chunkhash]可以认为是md5值，能确认文件的唯一性。只要改变就会改变
    },
    module:{
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),  //这个是内置插件，直接调用
        new htmlWebpackPlugin({
            template: './index.html',//指定参照物
            filename:"demo.html",//也可以指定名称,依旧可以用[name][hash]等占位符命名
            inject:"head",//指定引入文件的位置 "head"就是引入到head里面,如果直接模板页面引用这些false
            title:"webpack is good",//可以在这里面设定部分内容，然后再模板html里面进行引用,
            date:new Date(),
            chunks:["index","demo"],//选择使用部分
            minify:{//压缩
                //https://github.com/kangax/html-minifier#options-quick-reference这里可以查询设置
                removeComments:true,
                removeEmptyElements:true,
                useShortDoctype:true,
               //collapseWhitespace:true
            },
            //设置匹配。与扩展插件对应
            inlineSource : '.(js|css)$'
        }),
        //调用扩展插件
        new htmlWebpackInlineSourcePlugin(),
        //引入多个html可以直接多次调用该函数就好
        new htmlWebpackPlugin({
            template: './index.html',
            filename:"a.html",
            inject:"head",
            chunks:["a"],
            title:"this is a.html",
            inlineSource : '.(js|css)$'
        }),
        new htmlWebpackPlugin({
            template: './index.html',
            filename:"b.html",
            inject:"head",
            chunks:["b"],
            title:"this is b.html",
            inlineSource : '.(js|css)$'
        })
    ]

};
module.exports = config;