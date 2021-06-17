const path = require('path');
const fs = require('fs');
const util= require('util');
const { URL } = require('url')
const { promisify } = util;
const stat = promisify(fs.stat); // fs.stat promisify
const whitList = [
    'localhost:8080',
    'www.pic1.me:8080'
]
class LinkController {
    
    static async getImg(ctx){
        let referer = ctx.header['referer']; // http://localhost:8080/
        let imgName = ctx.params.id;
        let realPath = path.join(__dirname,'../lib',imgName);
        try{
            let statObj = await stat(realPath);
            if(statObj){
                let h = ctx.host; // localhost:3000 => 请求头中的host
                let r = new URL(referer).host;  // localhost:8080 => 浏览器的地址栏决定的
                if(h == r || whitList.includes(r)){
                    ctx.body = fs.createReadStream(realPath)
                }else{
                    ctx.body = fs.createReadStream(path.join(__dirname,'../lib','/2.jpeg'))
                }
            }
        }catch(e){
            ctx.body = fs.createReadStream(path.join(__dirname,'../lib','/2.jpeg'))
        }
        
    }
}

module.exports = LinkController;