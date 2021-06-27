let uuid = require('uuid');
const session = {};
const cardName = 'connect.sid'; // 每个服务可能定义的 cardName 不一样
class SessionController {
    static async visit(ctx){
        let cardId = ctx.getCookie(cardName);
        if(cardId && session[cardId]){ // 不是首次 (服务重新启动，session丢失，就不认了)-> session持久化 -> 数据库，redise
            session[cardId].m -= 10;
            ctx.body = `${session[cardId].m} $`
        }else{ // 第一次 发卡存session
            let cardId = uuid.v4();
            session[cardId] = { m : 100 };
            ctx.setCookie(cardName,cardId, {httpOnly:true});
            ctx.status = 200;
            ctx.body = `100 $`
        }
    }
}

module.exports = SessionController;