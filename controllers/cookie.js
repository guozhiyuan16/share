
class CookieController {
    static async writeCookie(ctx){
        ctx.set('Set-Cookie',['name=gzy; max-age=10','age=18; httpOnly=true'])
        ctx.status = 200;
    }

    static async readCookie(ctx){

    }
}

module.exports = CookieController;