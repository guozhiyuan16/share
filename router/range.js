const Router = require('koa-router');
const router = new Router();
const { download } = require('../controllers/range');
router.get('/download/:id', download); // 下载指定文件

module.exports = router;