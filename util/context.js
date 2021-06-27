const querystring = require('querystring'); // node 内置
const crypto = require('crypto');
const config = require('../config');

function signed(value){
    return crypto.createHmac('sha256',config.TOKEN.secret).update(value.toString()).digest('base64');   
}


let cookies = [];
function setCookie(key,value,options = {}){
    const ctx = this;
    let optArgs = [];
    
    if(options.maxAge){
        optArgs.push(`max-age=${options.maxAge}`)
    }
    if(options.path){
        optArgs.push(`path=${options.path}`)
    }
    if(options.httpOnly){
        optArgs.push(`httpOnly=${options.httpOnly}`)
    }
    if(options.signed){
        value = value + '.' + signed(value);
    }
    let cookieVal = `${key}=${value}`
    cookies.push(`${cookieVal}; ${optArgs.join('; ')}`)
    ctx.set('Set-Cookie',cookies)
}


function getCookie(key,options = {}){
    const ctx = this;
    // 将key=value => {key:value}
    // console.log(querystring.parse('nzme=xxx&age=111'));
    let cookieObj = querystring.parse(ctx.header['cookie'],'; '); 
    if(options.signed){ // 需要判断信息是否被篡改
        let [value,sign] = cookieObj[key].split('.');
        if(signed(value) == sign){
            return value;
        }else{
            return ''; // 校验失败了，cookei可能被篡改
        }
    }else{
        return cookieObj[key] && cookieObj[key].split('.')[0]
    }
}

module.exports = {
    setCookie,
    getCookie,
    signed
}