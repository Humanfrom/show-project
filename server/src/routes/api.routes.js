const Router = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const BoxController = require('../controllers/BoxController');
const SubscriptionController = require('../controllers/SubscriptionController');
const DeliveryController = require('../controllers/DeliveryController');
const ClassifierController = require('../controllers/ClassifierController');
const TestController = require('../controllers/TestController');

const router = new Router();

router.post('/create_box', authMiddleware, BoxController.createBox);
router.put('/update_box', authMiddleware, BoxController.updateBox);
router.delete('/delete_box', authMiddleware, BoxController.deleteBox);
router.get('/get_box', BoxController.getBox);
router.get('/get_boxes', BoxController.getAllBoxes);
//router.post('/reserve_box', authMiddleware, BoxController.reserveBox );

router.get('/get_subscriptions', authMiddleware, SubscriptionController.getSubscription );
router.get('/get_subscriptions', authMiddleware, SubscriptionController.getAllSubscriptions );
router.post('/create_subsctibe', authMiddleware, SubscriptionController.createSubscription );
router.post('/buy_subscription', authMiddleware, SubscriptionController.buySubscription );
router.get('/get_payment_link', authMiddleware, SubscriptionController.getPaymentLink );
router.delete('/stop_subscription', authMiddleware, SubscriptionController.stopSubscription );

router.post('/check_delivery', authMiddleware, DeliveryController.checkDelivery );
//router.post('/update_delivery', authMiddleware, DeliveryController.updateDelivery );

//router.get('/get_tarrifs', authMiddleware, ClassifierController.getSubscriptions );

//----------------------------------

router.post('/test', (req, res, next) => next() ,TestController.test);

module.exports = router;