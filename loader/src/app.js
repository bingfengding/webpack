import "./css/common.css";
import Layer from "./compontants/layer/layer.js";

    const app = function () {
        let dom =document.getElementById("app");
        let web = new Layer();
        //dom.innerHTML=web.tpl;如果是字符串就这么写就好，引入的是html文件
        dom.innerHTML=web.tpl({
            name:"sea",
            arr:["ipad","mini","iphone"]
        });
    };
    new app();

