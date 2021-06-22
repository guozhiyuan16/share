const Router = require('koa-router');
const router = new Router();
const { writeCookie ,readCookie} = require('../controllers/cookie');
router.get('/write', writeCookie);
router.get('/read', readCookie);

module.exports = router;