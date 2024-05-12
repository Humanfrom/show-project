const bcrypt = require("bcryptjs");
const config = require("config");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const winston = require("winston");
const TelegramBotController = require("../controllers/TelegramBotController");
const nodemailer = require("nodemailer");

const { v4: uuidv4 } = require("uuid");
const YandexDeliveryService = require("./delivery/YandexDeliveryService");
const DeliveryService = require("./DeliveryService");

/**
 *  contact: {type: String},
    boxes: {type: Array},
    status: {type: String},
    period: {type: Object},
    comments: {type: String},
    delivery: {type: Object},
    user_id: {type: Object},
    payments_confirmed: {type: Array},
    uuid
})
 */

class SubscriptionService {
  create(subscription, user) {
    const uuid = uuidv4();
    try {
      const delivery = new DeliveryService().create({
        ...subscription.delivery, uuid 
      });

      if (delivery.error) {
        return { error: delivery.error };
      }

      const newSubscription = new Subscription({
        ...subscription,
        status: "created",
        user_id: user._id,
        delivery,
        uuid,
      });


    } catch (error) {
      return { error };
    }

    return newSubscription;
  }
}

module.exports = SubscriptionService;
