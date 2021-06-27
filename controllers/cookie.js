class CookieController {
    static async writeCookie(ctx){
        // cookie 就是一个header, 默认cookie会话结束时销毁，如果增加失效时间，可以延迟

        // key=value
        // ctx.set('Set-Cookie',['name=gzy','age=18','address=BJ']); // 设置值

        // domain 限制域名,默认为当前域名
        // 只要是gzy.com 结尾都能访问到（a.gzy.com和b.gzy.com都能读取name=gzy）
        // ctx.set('Set-Cookie',['name=gzy; domain=gzy.com','age=18','address=BJ']); // 设置值

        // path 限制设置cookie的路径（基本用不到）
        // ctx.set('Set-Cookie',['name=gzy; domain=gzy.com','age=18; path="/read"','address=BJ']); // 设置值
        
        // maxAge (多少秒后) / expires (确切的时间段)
        // ctx.set('Set-Cookie',['name=gzy; domain=gzy.com','age=18; path="/read"','address=BJ; max-age=10']); // 设置值
        
        // httpOnly (不能通过代码修改cookie)
        // ctx.set('Set-Cookie',['name=gzy; domain=gzy.com; httpOnly=true','age=18; path="/read"; httpOnly=true','address=BJ; max-age=10;']); // 设置值

        // 想要这样设置cookie
        // ctx.setCookie('name','gzy', {maxAge:10})
        // ctx.setCookie('age',10, {path:'/',httpOnly:true})

        // cookie 不存敏感信息，并给cookie内容加一个签名，篡改就失效 -> 不能md5 
        // cookie加密
        ctx.setCookie('name','gzy', {maxAge:10})
        ctx.setCookie('age',10, {path:'/',httpOnly:true,signed:true})
        ctx.status = 200;
        ctx.body = "write cookie"
    }

    static async readCookie(ctx){
        // let cookie = ctx.header['cookie'];
        let value = ctx.getCookie('age',{signed:true}) // 需要判断是否篡改传 signed:true
        ctx.body = value;
    }
}

module.exports = CookieController;