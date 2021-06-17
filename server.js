const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const logger = require('koa-logger');

// const static = require('koa-static');
const views = require('koa-views');

// 静态资源目录对于相对入口文件index.js的路径
// const staticPath = './lib'
const loadRouter = require('./router');

let app = new Koa;

// moddlewares
const authHandler = require('./middlewares/authHandler');
const cacheHandler = require('./middlewares/cacheHandler');

app
  .use(cors())
  .use(
    koaBody({
      multipart:true, // 支持文件上传
      encoding:'gzip',
      formidable:{
        keepExtensions: true, // 保持文件的后缀
        maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
      }
    })
  )
  .use(views(path.join(__dirname, 'view'), { // 加载模板引擎
    extension: 'ejs'
  }))
  .use(cacheHandler)
  .use(authHandler)
  // .use(static(
  //   path.join( __dirname,  staticPath)
  // ))
  .use(logger())


loadRouter(app)

app.listen(3000,(err)=>{
    if(err) return console.log(err)
    console.log(`server listen 3000`)
})