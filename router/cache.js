const Router = require('koa-router');
const router = new Router();
const { indexPage } = require('../controllers/cache');

router.get('/xxx',indexPage);

module.exports = router;