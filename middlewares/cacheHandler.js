const path = require('path');
const fs = require('fs');
const util = require('util');
const { promisify } = util;
const stat = promisify(fs.stat);
const extWhiteList = ['.html','.js','.css']; // 只有这些后缀为静态文件，其他接口
const crypto = require('crypto');

module.exports = async (ctx,next) => {
    let extName = path.extname(ctx.url);
    if(ctx.method === 'GET' && extWhiteList.includes(extName)){
        let realPath = path.join(__dirname,'../','/page',ctx.url); // 请求路径
        try{
            let statObj = await stat(realPath);
            if(statObj){
                if(statObj.isFile()){
                    // 强制缓存
                    // ctx.set('Cache-Control','max-age=10'); // chrome
                    // ctx.set('Expires', new Date(Date.now() + 10 * 1000).toUTCString()); // IE 需要设置绝对时间 （兼容写法优先级低）
                    // ctx.type = path.extname(realPath);
                    // ctx.status = 200;
                    // ctx.body = await fs.createReadStream(realPath);

                    // 协商缓存
                    // 1) Last-Modified 和 If-Modified-Since
                    // let ifModifySince = ctx.header['if-modified-since'];
                    // if(ifModifySince && ifModifySince ==  statObj.ctime.toUTCString()){ // 文件没有变化
                    //     ctx.status = 304;
                    // }else{
                    //     ctx.set({
                    //         'Last-Modified':statObj.ctime.toUTCString(),
                    //         'Cache-Control':'no-cache'
                    //     })
                    //     ctx.type = path.extname(realPath);
                    //     ctx.status = 200;
                    //     ctx.body = await fs.createReadStream(realPath);
                    // }

                    // 2) E-Tag 和 If-None-Match
                    // let ifNoneMatch = ctx.header['if-none-match'];
                    // let strOrBuffer = fs.readFileSync(realPath);
                    // let eTag = crypto.createHash('md5').update(strOrBuffer).digest('base64');
                    // if(ifNoneMatch && ifNoneMatch ==  eTag){ // 文件没有变化
                    //     ctx.status = 304;
                    // }else{
                    //     ctx.set({
                    //         'ETag':eTag,
                    //         'Cache-Control':'no-cache'
                    //     })
                    //     ctx.type = path.extname(realPath);
                    //     ctx.status = 200;
                    //     ctx.body = await fs.createReadStream(realPath);
                    // }


                    // 强制缓存 + 协商缓存
                    function cache(){
                        let lastModified = statObj.ctime.toUTCString();
                        let eTag = crypto.createHash('md5').update(fs.readFileSync(realPath)).digest('base64');
                        // let eTag = crypto.createHash('sha1').update(stat.ctime.toGMTString() + stat.size).digest('hex');
                        ctx.set({
                            'Cache-Control':'max-age=10',
                            'Last-Modified':lastModified,
                            'ETag':eTag,
                        })

                        let ifNoneMatch = ctx.header['if-none-match'];
                        let ifModifySince = ctx.header['if-modified-since'];
                        if(lastModified!=ifModifySince){
                            return false
                        }
                        if(eTag!=ifNoneMatch){
                            return false
                        }
                        return true
                    }
                    if(cache()){
                        ctx.status = 304;
                    }else{
                        ctx.type = path.extname(realPath);
                        ctx.status = 200;
                        ctx.body = await fs.createReadStream(realPath);
                    }
                }
            }
        }catch(e){
            ctx.throw(404)
        }
    }
    await next();
}