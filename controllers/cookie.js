class CookieController {
    static async writeCookie(ctx){
        ctx.set('Set-Cookie',['name=gzy; max-age=10','age=18; httpOnly=true; '])
        // ctx.setCookie()
        ctx.status = 200;
        ctx.body = "write cookie"
    }

    static async readCookie(ctx){
        let cookie = ctx.header['cookie'];
        ctx.body = cookie;
    }
}

module.exports = CookieController;