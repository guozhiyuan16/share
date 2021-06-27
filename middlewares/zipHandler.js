const path = require('path');
const fs = require('fs');
const util = require('util');
const zlib = require('zlib');
const { promisify } = util;
const stat = promisify(fs.stat);
const zipWhiteList = ['.html','.js','.css','.jpeg','.png'];
module.exports = async (ctx,next) => {
    let extName = path.extname(ctx.url);
    if(ctx.method === 'GET' && zipWhiteList.includes(extName)){
        let encoding = ctx.header['accept-encoding']; // gzip, deflate, br
        let realPath = path.join(__dirname,'../','/page',ctx.url); // 请求路径
        try{
            let statObj = await stat(realPath);
            if(statObj){
                if(statObj.isFile()){
                    if(encoding.includes('gzip')){
                        ctx.set('Content-Encoding','gzip');
                        ctx.type = path.extname(realPath);
                        ctx.status = 200;
                        ctx.body = fs.createReadStream(realPath).pipe(zlib.createGzip())
                    }
                }
            }
        }catch(e){
            ctx.throw(404)
        }
    }
    await next();
}