const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const AuthService = require("../services/AuthService");
const NotificationService = require("../services/NotificationService");

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: `Некорректный запрос`, message: errors });
      }

      const { login, password, contactType, contact } = req.body;
      const candidate = await User.findOne({ login });
      if (candidate) {
        return res
          .status(400)
          .json({ error: `Пользователь с логином ${login} уже существует` });
      }

      const hashPassword = await bcrypt.hash(password, 7);
      const chatKey = uuidv4();
      const user = new User({
        login,
        password: hashPassword,
        contact,
        contact_type: contactType,
        chat_key: chatKey,
      });
      await user.save();

      const notification = NotificationService.sendConfirmation(user);

      return res.json({ success: "ok" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ошибка. Указаны некорректные данные" });
    }
  }

  async login(req, res) {
    try {
      const authData = String(req.headers["authorization"]).replace(
        "Basic ",
        ""
      );
      const [login, password] = Buffer.from(authData, "base64")
        .toString("utf-8")
        .split(":");
      const user = await User.findOne({ login });
      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      const isPassValid = bcrypt.compareSync(password, user.password);
      if (!isPassValid) {
        return res.status(400).json({ error: "Неверный пароль" });
      } else if (!user.confirmed) {
        return res.status(400).json({ error: "Пользователь не подтверждён" });
      }

      const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
        expiresIn: "3h",
      });
      return res.json({
        token,
        user: {
          id: user.id,
          login: user.login,
          info: user.info || "",
          status: user.status,
          grade: user.grade,
        },
      });
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Ошибка. Указаны некорректные данные" });
    }
  }

  async recover(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: `Некорректный запрос`, message: errors });
      }

      if (req.query.type == "recover") {
        const { login } = req.body;
        const user = await User.findOne({ login });
        if (!user) {
          return res.status(400).json({ error: `Ссылка не действительна` });
        }
        const hashRecovery = await bcrypt.hash(`${login}_${Date.now()}`, 7);
        user.hash = hashRecovery;
        await user.save();

        const notification = NotificationService.sendResetLink(
          user,
          hashRecovery
        );
        if (notification.success) {
          setTimeout(() => {
            user.hash = null;
            user.save();
          }, 60000 /*3600000*/);
          return res.json({ success: true });
        }
        return res.status(500).json({ error: notification.error });
      } else if (req.query.type == "reset") {
        const { hash, password } = req.body;

        const user = await User.findOne({ password: hash });
        if (!user) {
          return res
            .status(400)
            .json({ error: `Непредвиденная фатальная ошибка` });
        }

        const hashPassword = await bcrypt.hash(password, 7);
        user.password = hashPassword;
        user.hash = null;

        await user.save();
        return res.json({ success: true });
      }
    } catch (error) {
      return res.status(500).json({ error: "Указаны некорректные данные" });
    }
  }

  async check(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: `Некорректный запрос`, message: errors });
      }

      if (req.query?.type) {
        const { ref } = req.query;
        const user = await User.findOne({ hash: ref });

        if (!user) {
          return res.status(400).json({ error: "Ссылка не действительна" });
        }

        const confirm = user.password;
        if (confirm) {
          return res.json({ confirm });
        }
      }
      return res.status(500).json({ error: "Ссылка не действительна" });
    } catch (error) {
      return res.status(500).json({ error: "Ссылка не действительна" });
    }
  }

  async getUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: `Некорректный запрос`, message: errors });
      }

      const [ type, token ] = req.headers["authorization"].split(' ');
      const { id } = await jwt.verify(token, config.get("secretKey"));
      const user = await User.findById(id);
      if (user) {
        return res.json({
          id: user.id,
          login: user.login,
          info: user.info || "",
          delivery: user.delivery,
          status: user.status,
          achievements: user.achievements,
          grade: user.grade,
        });
      }
      return res.status(404).json({ error: "Пользователь не найден" });
    } catch (error) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
  }

  async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: `Некорректный запрос`, message: errors });
      }

      const [ type, token ] = req.headers["authorization"].split(' ');
      const { id } = await jwt.verify(token, config.get("secretKey"));
      const user = await User.findById(id);
      if (user) {
        const data = req.body;
        for (let prop in data) {
          user[prop] = data[prop];
        }
        console.log(user)
        await user.save();

        return res.json({
          id: user.id,
          login: user.login,
          info: user.info || "",
          delivery: user.delivery,
          status: user.status,
          achievements: user.achievements,
          grade: user.grade,
        });
      }
      return res.status(404).json({ error: "Пользователь не найден" });
    } catch (error) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
  }

  async addRecipient(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: `Некорректный запрос`, message: errors });
      }

      const token = req.headers["authorization"];
      const { id } = await jwt.verify(token, config.get("secretKey"));

      const user = await User.findById(id);
      const { recipient } = req.body;
      if (user && recipient) {
        user.delivery = user.delivery
          ? [...user.delivery, { ...recipient }]
          : [{ ...recipient }];
        user.save();
        return res.json(user.delivery);
      }
      return res.status(404).json({ error: "Ошибка выполнения запроса" });
    } catch (error) {
      return res.status(404).json({ error: "Ошибка выполнения запроса" });
    }
  }
}

module.exports = new AuthController();
