const Subscription = require("../models/Subscription");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const SubscriptionService = require("../services/SubscriptionService");

class SubscriptionController {
  async createSubscription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Некорректный запрос`, errors });
      }

      const token = req.headers["authorization"];
      const { id } = await jwt.verify(token, config.get("secretKey"));
      const user = await User.findById(id);

      if (user) {
        const { delivery, subscription } = req.body;
        const newSubscription = await new SubscriptionService().create(subscription, user);
        user.subscriptions.push(newSubscription);
        await user.save();

        /*return res.json({
          id: user.id,
          login: user.login,
          info: user.info || "",
          status: user.status,
          achievements: user.achievements,
          grade: user.grade,
        });*/
        

        //const subscription = new Subscription({ ...data, hash: SubscriptionHash });

        await Subscription.save();
        return res.json(Subscription);
      }
      return res.status(500).json("Пользователь не найден");
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async getSubscription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Некорректный запрос`, errors });
      }

      const { field, value, limit } = req.query;
      let data = {};
      if (field && value) {
        data[field] = value;
      }
      const Subscriptions = limit
        ? await Subscription.find(data).limit(limit)
        : await Subscription.find(data);

      if (!Subscriptions) {
        return res
          .status(400)
          .json({ message: `Отсутствуют ученики по Вашему запросу` });
      }

      return res.json(Subscriptions);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async getAllSubscriptions(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Некорректный запрос`, errors });
      }

      const { field, value, limit } = req.query;
      let data = {};
      if (field && value) {
        data[field] = value;
      }
      const Subscriptions = limit
        ? await Subscription.find(data).limit(limit)
        : await Subscription.find(data);

      if (!Subscriptions) {
        return res
          .status(400)
          .json({ message: `Отсутствуют ученики по Вашему запросу` });
      }

      return res.json(Subscriptions);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async buySubscription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Некорректный запрос`, errors });
      }

      const { field, value, limit } = req.query;
      let data = {};
      if (field && value) {
        data[field] = value;
      }
      const Subscriptions = limit
        ? await Subscription.find(data).limit(limit)
        : await Subscription.find(data);

      if (!Subscriptions) {
        return res
          .status(400)
          .json({ message: `Отсутствуют ученики по Вашему запросу` });
      }

      return res.json(Subscriptions);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async getPaymentLink(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Некорректный запрос`, errors });
      }

      const { field, value, limit } = req.query;
      let data = {};
      if (field && value) {
        data[field] = value;
      }
      const Subscriptions = limit
        ? await Subscription.find(data).limit(limit)
        : await Subscription.find(data);

      if (!Subscriptions) {
        return res
          .status(400)
          .json({ message: `Отсутствуют ученики по Вашему запросу` });
      }

      return res.json(Subscriptions);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async stopSubscription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Некорректный запрос`, errors });
      }

      const { SubscriptionHash } = req.body;
      const Subscription = await Subscription.deleteOne({ hash: SubscriptionHash });
      if (!Subscription.deletedCount) {
        return res.status(400).json({ message: `Не удалось удалить` });
      }

      return res.json(Subscription);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }
}

module.exports = new SubscriptionController();
