const fs = require('fs');
const path = require('path');
class LanController {
    
    static async indexPage(ctx){
        // console.log('url',ctx.url)
        // const indexPagePath = path.join(__dirname,'../static/cache.html');
        // ctx.type = 'html'
        // ctx.body = fs.createReadStream(indexPagePath);
    }
}

module.exports = LanController;