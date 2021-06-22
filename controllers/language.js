
const langPkg = {
    'zh-CN':{
        data:"你好，世界!"
    },
    'en':{
        data:"hello world!"
    },
    'jp':{
        data:"こんにちは世界!"
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
                if(langPkg[lanName]){
                    ctx.body = langPkg[lanName].data;
                    return;
                }
            }
        }else{
            ctx.body = langPkg[defaultLanguage].data;
        }
    }
}

module.exports = LanController;