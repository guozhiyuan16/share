const path = require('path');
const fs = require('fs');
const util = require('util');
const { promisify } = util;
const stat = promisify(fs.stat);

class RangeController {
    static async download(ctx){
        let downloadName = ctx.params.id; // 下载文件名
        let rPath = path.join(__dirname,'../download',downloadName);
        try{
            let statObj = await stat(rPath);
            let range = ctx.header['range'];
            if(range){
                let matches = range.match(/(\d*)-(\d*)/);
                let [,start,end] = matches;
                start = start? Number(start):0;
                end = end? Number(end): statObj.size;
                ctx.status = 206;
                ctx.set({
                    'Content-range':`bytes ${start}-${end}/${statObj.size}`,
                    'Content-Length':end-start+1
                })
                ctx.body = fs.createReadStream(rPath,{start,end})
            }
        }catch(e){
            ctx.throw(404)
        }
    }
}

module.exports = RangeController;