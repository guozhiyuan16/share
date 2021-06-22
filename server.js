const Koa = require('koa');
const path = require('path');
// const cors = require('koa2-cors');
// const koaBody = require('koa-body');
const logger = require('koa-logger');

// const static = require('koa-static');
// const views = require('koa-views');

// 静态资源目录对于相对入口文件index.js的路径
// const staticPath = './lib'
const loadRouter = require('./router');

let app = new Koa;

// middlewares
const cacheHandler = require('./middlewares/cacheHandler');
const refererHandler = require('./middlewares/refererHandler');
const zipHandler = require('./middlewares/zipHandler');

app
  // .use(cors()) // 解决跨域问题中间件
  // .use( // 解析请求体中间件
  //   koaBody({
  //     multipart:true, // 支持文件上传
  //     encoding:'gzip',
  //     formidable:{
  //       keepExtensions: true, // 保持文件的后缀
  //       maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
  //     }
  //   })
  // )
  // .use(views(path.join(__dirname, 'view'), { // 加载模板引擎中间件
  //   extension: 'ejs'
  // }))
  // .use(zipHandler)
  .use(refererHandler)
  .use(cacheHandler)
  
 
  // .use(static( // 加载静态服务中间件
  //   path.join( __dirname,  staticPath)
  // ))
  .use(logger()) // 日志中间件


loadRouter(app)

app.listen(3000,(err)=>{
    if(err) return console.log(err)
    console.log(`server listen 3000`)
})