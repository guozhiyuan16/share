const Koa = require('koa');
// const cors = require('koa2-cors');
const koaBody = require('koa-body');
const logger = require('koa-logger');

const config = require('./config'); // 配置文件

// const views = require('koa-views');
const loadRouter = require('./router');

let app = new Koa;
// context binding...
const context = require('./util/context');
Object.keys(context).forEach(key => {
    app.context[key] = context[key] // 绑定上下文对象
})

// middlewares
const cacheHandler = require('./middlewares/cacheHandler');
const refererHandler = require('./middlewares/refererHandler');
const zipHandler = require('./middlewares/zipHandler');

app
  // .use(cors()) // 解决跨域问题中间件
  .use( // 解析请求体中间件
    koaBody({
      multipart:true, // 支持文件上传
      encoding:'gzip',
      formidable:{
        keepExtensions: true, // 保持文件的后缀
        maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
      }
    })
  )
  // .use(views(path.join(__dirname, 'view'), { // 加载模板引擎中间件
  //   extension: 'ejs'
  // }))
  .use(refererHandler)
  .use(cacheHandler)
  //.use(zipHandler)
  .use(logger()) // 日志中间件


loadRouter(app); // 加载所有路由

app.listen(config.PORT,( err )=>{
    if(err) return console.log(err)
    console.log(`server listen on http://127.0.0.1:${config.PORT}`)
})