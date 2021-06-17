
const language = {
    'zh-CN':{
        email:"邮箱",
        emailPla:"请填写邮箱",
        password:"密码",
        passwordPla:"请填写密码",
        login:"登录"
    },
    'en':{
        email:"Email",
        emailPla:"please write your email",
        password:"Password",
        passwordPla:"please write your password",
        login:"Sign in"
    }
}
const defaultLanguage = 'en';
class LanController {
    
    static async language(ctx){
        let lan = ctx.header['accept-language'];
        if(lan){
            let languages = lan.split(',').map(l=>{
                let [name,q=1] = l.split(';');
                return {name,q : q == 1?1:Number(q.split('=')[1])}
            }).sort((a,b)=>b.q-a.q);
            for(let i = 0 ; i < languages.length; i++){
                let lanName = languages[i].name;
                if(language[lanName]){
                    await ctx.render('index', {
                        lan:language[lanName],
                    })
                }
            }
        }else{
            await ctx.render('index', {
                lan:language['defaultLanguage'],
            })
        }
       
    }
}

module.exports = LanController;