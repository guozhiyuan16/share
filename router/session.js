const Router = require('koa-router');
const router = new Router();
const { visit} = require('../controllers/session');
router.get('/visit', visit);

module.exports = router;