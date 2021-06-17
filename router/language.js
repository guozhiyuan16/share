const Router = require('koa-router');
const router = new Router();
const { language } = require('../controllers/language');

router.get('/language', language);

module.exports = router;