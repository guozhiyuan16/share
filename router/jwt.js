const Router = require('koa-router');
const router = new Router();
const { login,vilidate } = require('../controllers/jwt');

router.post('/login', login );
router.post('/vilidate', vilidate );

module.exports = router;