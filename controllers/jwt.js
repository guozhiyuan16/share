const jwt = require('jwt-simple');
const config = require('../config');

// let jwt = {
//     sign(content,secret){
//         return  this.base64UrlEscape(require('crypto').createHmac('sha256',secret).update(content).digest('base64'))
//     },
//     base64UrlEscape(content){
//         return content.replace(/\+/g,'-').replace(/\=/g,'').replace(/\//g,'_')
//     },
//     base64UrlUnEscape(str){
//         str += new Array(5 -str.length % 4).join('=');
//         return str,replace(/\-/g,'+').replace(/_/g,'/')
//     },
//     toBase64(content){
//        return this.base64UrlEscape(Buffer.from(JSON.stringify(content)).toString('base64')); // 有可能有 + / =
//     },
//     encode(info,secret){
//         let header = this.toBase64({type:"JWT",alg:"HS256"}); // 这个是固定的，写死的,表示是一个token
//         let content = this.toBase64(info); // 个人信息不要放在token里，存放一些用户的唯一标识就可以了

//         let sign = this.sign(header + '.' + content,secret);
//         return header + '.' + content + '.' + sign
//     },
//     decode(token){
//         let [header,content,sign] = token.split('.');
//         let newSign = this.sign(header + '.' + content,config.TOKEN.secret)
//         if(sign == newSign){
//             return JSON.parse(Buffer.from(this.base64UrlUnEscape(content),'base64').toString());
//         }else{
//             throw new Error('token error')
//         }
//     }
// }
 
class JwtController {
    static async login(ctx){
        let result = ctx.request.body
        if(result.username === 'admin' && result.password === 123456){
            ctx.status = 200;
            ctx.body = {
                msg:"登录成功",
                // token = 头(固定).内容（自定义）.秘钥
                token: jwt.encode({exp: new Date(Date.now() + 30 * 1000),
                    username:'admin'
                },config.TOKEN.secret),
            }
        }
        
    }

    static async vilidate(ctx){
        let token = ctx.header['authorization'];
        if(token){
            try{
                let payload = jwt.decode(token,config.TOKEN.secret);
                console.log(payload);
                let exp = new Date(payload.exp).getTime();
                if(exp < new Date().getTime()){
                    ctx.body = 'token 超时'
                    // 跳转登录 或者 返回一个新的token
                }else{
                    ctx.body = 'login ok'
                }
            }catch(e){
                console.log(e);
                ctx.status = 200;
                ctx.body = `token error`
            }
            
        }else{

        }
    }
}

module.exports = JwtController;