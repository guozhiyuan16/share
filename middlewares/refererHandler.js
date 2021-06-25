const path = require('path');
const fs = require('fs');
const util = require('util');
const { promisify } = util;
const stat = promisify(fs.stat);
const referList = ['.jpeg','.png']; // 只有这些后缀为静态文件，其他为借口
const whitList = [ // 可以正常访问图片的白名单
    'localhost:3000',
    'www.pic1.me:3000'
]
module.exports = async (ctx,next) => {
    let extName = path.extname(ctx.url);
    if(ctx.method === 'GET' && referList.includes(extName)){
        let realPath = path.join(__dirname,'../','/page',ctx.url); // 请求路径
        let defaultPath = path.join(__dirname,'../','/page/img/2.jpeg'); // 默认返回图片路径
        try{
            let statObj = await stat(realPath);
            if(statObj){
                if(statObj.isFile()){
                    let referer = ctx.header['referer']; // http://localhost:8080/
                    let h = ctx.host; // localhost:3000 => 请求头中的host
                    let r = new URL(referer).host;  // localhost:8080 => 浏览器的地址栏决定的
                    if(h == r || whitList.includes(r)){
                        ctx.body = await fs.createReadStream(realPath);
                    }else{
                        ctx.body = await fs.createReadStream(defaultPath);
                    }
                }
            }
        }catch(e){
            ctx.throw(404)
        }
    }
    await next();
}