//安装：npm install webpack -g   全局
//安装：npm install webpack --save-dev   开发

//打包一：
//webpack 原文件名 新文件名
//webpack hello.js hello.bulid.js
//webpack hello.js hello.bulid.js --module-bind "css=style-loader!css-loader"
//直接提前命令行内绑定，css的loader，这样就不用引用时候再输入loader
//webpack hello.js hello.bulid.js --module-bind "css=style-loader!css-loader" --watch
//自动打包
//webpack hello.js hello.bulid.js --module-bind "css=style-loader!css-loader" --progress
//打包进度
//webpack hello.js hello.bulid.js --module-bind "css=style-loader!css-loader" --display-modules
//打包的模块


//引用直接通过require进行引用
require("./world.js");
require("./style.css");



//require("style-loader!css-loader!./style.css"); 由于webpack是无法处理css的，需要加载loader来处理，css-loader是让webpack能识别css，style-loader是让css能在页面显示。
//可以直接在命令行
function hello(val) {
    alert(val);
}
hello("hello world!!!！！!!!");