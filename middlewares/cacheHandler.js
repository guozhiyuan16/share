const path = require('path');
const fs = require('fs');
const util = require('util');
const { promisify } = util;
const stat = promisify(fs.stat);

const staticPath = '/page'; // 静态资源文件相对server.js的路径

module.exports = async (ctx,next) => {
    
    if(ctx.method === 'HEAD' || ctx.method === 'GET'){
        let realPath = path.join(__dirname,'../',staticPath,ctx.url); // 请求路径
        try{
            let statObj = await stat(realPath);
            if(statObj){
                if(statObj.isFile()){
                    // 强制缓存
                    // ctx.set('Cache-Control','max-age=10'); // chrome
                    // ctx.set('Expires', new Date(Date.now() + 10 * 1000).toUTCString()); // IE 需要设置绝对时间 （兼容写法优先级低）

                    // 对比缓存
                    let ifModifySince = ctx.header['if-modified-since'];
                    if(ifModifySince && ifModifySince ==  statObj.ctime.toUTCString()){ // 文件没有变化
                        ctx.status = 304;
                        return;
                    }
                    ctx.set({
                        'Last-Modified':statObj.ctime.toUTCString(),
                        'Cache-Control':'no-cache'
                    })
                    // ctx.set('Last-Modified', statObj.ctime.toUTCString())
                    ctx.type = path.extname(realPath);
                    ctx.status = 200;
                    ctx.body = fs.createReadStream(realPath)   
                }
            }else{
                await next();
            }
        }catch(e){
            ctx.throw(404);
            await next();
        }
        await next();
    }
    await next();
}
