const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const DeliveryService = require("../services/DeliveryService");
const Delivery = require("../models/Delivery");

class DeliveryController {
  async checkDelivery(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Некорректный запрос`, errors });
      }

      const requestData = req.body;
      const deliveryData = await new DeliveryService().checkDelivery(requestData);

      if (deliveryData.error) {
        return res.json(deliveryData.error);
      }

      return res.json({ ...deliveryData });
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }
}

module.exports = new DeliveryController();
