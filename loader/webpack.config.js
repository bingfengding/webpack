const path = require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const extractTextPlugin = require('extract-text-webpack-plugin');//用来将CSS提取出来放到单独的文件内，先在loader里面获取，在new 1个插件
const cleanWebpackPlugin = require("clean-webpack-plugin");
/*其他：安装 cross-env  使用cross-env解决跨平台设置NODE_ENV的问题  */
const config = {
    target: 'web',//指定目标为web平台

    entry:{
        index:["./src/app.js"]
    },
    devtool: 'source-map',//可以详细看到报错原因。source-map有很多功能。
    module:{
        //模块配置
        rules:[
            //模块规则
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.jsx$/,
                loader:'babel-loader'
            },
            {
                test:/\.css$/,
                exclude:path.resolve(__dirname+'/node_modules/'),
                include:path.resolve(__dirname+'/src/'),
                use: extractTextPlugin.extract({//使用extractTextPlugin
                    fallback: {//输出时候使用的loader
                        loader:"style-loader",
                        options: {//设置
                            sourceMap: true,
                        }
                    },
                    use:[
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: true,
                                importLoaders: 1 //处理 .css文件中使用@import引用进来的文件，指css-loader后指定数量的loader处理import引用进来的资源
                            }
                        },
                        {
                            loader:"postcss-loader",
                            options:{
                                sourceMap: true,
                                plugins:function () {
                                    return [
                                        require('postcss-import'),//如果不安装这个，那么css通过import进来的css不会转换
                                        require("autoprefixer")({//自动处理class前缀，让版本兼容
                                            browsers:["last 5 versions"]//低版本兼容处理，最近的5个版本
                                        })
                                    ]
                                }
                            }
                        }//npm i postcss-loader --save-dev   安装postcss-import，后处理的,让es6语法等转换为当前浏览器支持的。也可以创建postcss.config.js 内输入module.exports = {plugins:[require("autoprefixer")]};用来添加组件或通过这种方式加载
                    ]
                })
        },
       {
            test:/\.styl$/,
           exclude:path.resolve(__dirname+'/node_modules/'),
           include:path.resolve(__dirname+'/src/'),
           use: extractTextPlugin.extract({
                   fallback: {
                       loader:"style-loader",
                       options: {

                       }
                   },
            use:[
                {
                    loader:"css-loader",
                    options: {

                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                       /* plugins: function() {//已经有了配置文件所以不用这个了
                            return [
                                require('autoprefixer')
                            ];
                        }*/
                    }
                },
                {
                    loader:"stylus-loader",
                },

            ],})

        },
            {
                test:/\.(png|jpg|jpeg|gif|svg)$/i,
                exclude:path.resolve(__dirname+'/node_modules/'),
                use:[

                    {loader:"file-loader",
                     query:{
                     name:'images/[name]-[hash:8].[ext]',
                     //outputPath: 'img'
                     }
                     },
                    {loader:"url-loader",//url-loader其他方面都与file-loader一样，唯一区别是设定了1个limit值，当图片小于这个数值的时候，将会转换为bat64位编码，如果大于就依旧使用file-loader打包.需要同时安装file-loader
                        query:{
                            limit: 20000,
                            name:'images/[name]-[hash:8].[ext]',
                            //outputPath: 'img'
                        }
                    },
                    {
                        loader:"image-webpack-loader"//打包图片的loader需要配合，file或url使用
                    },

                ]
            },
           {
                test:/\.html$/,
                exclude:path.resolve(__dirname+'/node_modules/'),
                include:path.resolve(__dirname+'/src/'),
                use: [ {loader:"html-loader"} ]//html-loader与html-webpack-plugin有冲突，建议include制定位置来排除一定的冲突
            },
            {
                test:/\.ejs/,//适合模块文件，并且可以用来减少上面2个的冲突
                exclude:path.resolve(__dirname+'/node_modules/'),
                include:path.resolve(__dirname+'/src/'),
                use: [ {loader:"ejs-loader"} ]
            },

        {
            test:/\.js$/, //匹配条件，接收正则或字符串
            exclude:path.resolve(__dirname+'/node_modules/'),//排除加载范围优先于include与test
            include:path.resolve('/src/'),//babel-loader的处理范围
            use:[
            {loader:"babel-loader",//使用对应的loader
                query:{
                    preset:["env"],   //添加到这里面告诉babel如何处理这些JS，还有2个方式，1个是创建.babelrc 文件，添加{"presets": ["env"]}  或者在package.json 里面添加"babel":{"presets":["env"]}
                    plugins:[
                        'transform-vue-jsx'//用来转化VUE里面的jsx
                    ]
            }
            }
        ]},//一个用来让低版本浏览器支持最新es6语法的编辑器，安装  $ npm install babel-preset-env --save-dev    $ npm install babel-loader babel-core 更多的见https://babeljs.cn

    ]},
    devServer:{//一个监听的插件，需要全局安装1次，npm install -g webpack-dev-server  ,然后在packjson中添加进去，可以替代掉webpack 自带的-watch
        compress:true,
        port:9000,//修改监听的端口号
        open:true,//监听时候自动打开浏览器
        proxy:{
           // "/api":{
          //      target:"请求的地址"
         //   }  //代理设置  请求对应api的时候就自动使用对应代理
        },
        hot:true//开启热模块
    },
    plugins:[
        new htmlWebpackPlugin({
            template:"./index.ejs",
            filename:"index.html",
            inject:"body",
            minify:{
                removeComments:true,
                removeEmptyElements:true,
                useShortDoctype:true,
            },
            chunks:["index"],
            inlineSource:".(js|css)$"

        }),
        new htmlWebpackInlineSourcePlugin(),
        new extractTextPlugin({
            filename:'css/style.css',

        }),
        new cleanWebpackPlugin(//用来清除文件的
            //["dist"]
        ),
        new webpack.ProvidePlugin({//自动加载 jquery,之后就可以在源码中使用jquery的方法
            $: 'jquery',
            jQuery: 'jquery',
            //Vue: ['vue/dist/vue.esm.js', 'default']//调用vue

        }),
        new webpack.NamedModulesPlugin(),//热模块需要的组件
        new webpack.HotModuleReplacementPlugin()//热模块需要的组件
        ],
    output:{
        path: path.resolve(__dirname, 'dist'),
        //path.resolve 为解析的意思，path是Npm的API，resolve是API的方法。__dirname 为在运行环境下的路径，后面是相对路径。也就是带着当前的目录+相对路径解析成绝对路径
        publicPath:"www.mydarksea.com",//设定上线之后的地址
        filename:"js/[name].bundle.js"
    },
};
module.exports=config;