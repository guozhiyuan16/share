const path = require('path');
const fs = require('fs');
const util = require('util');
const { promisify } = util;
const stat = promisify(fs.stat);

const staticPath = '/page'; // 静态资源文件相对server.js的路径

module.exports = async (ctx,next) => {
    
    if(ctx.method === 'HEAD' || ctx.method === 'GET'){
        let realPath = path.join(__dirname,'../',staticPath,ctx.url); // 请求路径
        let statObj;
        try{
            statObj = await stat(realPath);
            if (statObj.isDirectory()){
                realPath += `index.html`
                statObj = await stat(realPath);
            }
            if(statObj){
                ctx.type = path.extname(realPath);
                ctx.body = fs.createReadStream(realPath)
            }
        }catch(e){
            ctx.throw(404)
        }
    }
    await next();
}