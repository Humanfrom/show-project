const Router = require('express');
const {check} = require('express-validator');
const authController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router.post('/registration', [
    check('login', 'Некорректный логин').isString(),
    check('password', 'Пароль должен состоять не менее 8 и не более 24 символов').isLength({min: 8, max: 24})
], authController.registration)

router.post('/login', authController.login)
router.post('/recover', authController.recover)
router.put('/recover', authController.recover)
router.get('/recover', authController.check)

router.get('/get_user', authMiddleware, authController.getUser)
router.put('/update_user', authMiddleware, authController.updateUser)
router.post('/add_recipient', authMiddleware, authController.addRecipient)


module.exports = router;