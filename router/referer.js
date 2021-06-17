const Router = require('koa-router');
const router = new Router();
const { getImg } = require('../controllers/referer');

router.get('/resource/:id', getImg);

module.exports = router;