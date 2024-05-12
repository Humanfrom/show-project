const bcrypt = require("bcryptjs");
const qr = require("qrcode");
const User = require("../models/User");
const winston = require("winston");
const config = require("config");

// Создание логгера
const logger = winston.createLogger({
  level: "info", // уровень логирования
  format: winston.format.json(), // формат записи логов
  transports: [
    new winston.transports.File({ filename: "./public/logs/combined.log" }),
  ],
});

//------------------ временные массивы ------------------------
const salesArray = [
  "Весенние улуны - скидка 50%",
  "Элитные наборы пуэров - +1 чай в подарок",
  "Премиум статус за красный чай",
  "Ароматика - 2 по цене 1",
];

class TelegramBotService {
  constructor() {
    this.chatHash = null;
    this.currentPage = "К приветствию";
    this.user = { role: "guest", name: "гость" };
    this.chatKey = null;
    this.bot = null;
  }

  async reinit(chatId, bot) {
    const user = await User.findOne({ chat_id: Number(chatId) });

    this.chatHash = await bcrypt.hash(chatId + "_chat", 5);
    this.currentPage = user ? "📱 Меню" : "К приветствию";
    this.user = user
      ? { role: user._doc.status, name: user._doc.login, ...user }
      : { role: "guest", name: "гость" };
    this.chatKey = null;
    this.bot = bot;
  }

  sendMessage(chatId, text, options) {
    this.bot.sendMessage(chatId, text, options);
  }

  async getUser(text = null) {
    try {
      const user = text
        ? await User.findOne({ chat_key: String(text).trim() })
        : await User.findOne({ chat_hash: this.chatHash });
      return user;
    } catch (e) {
      return null;
    }
  }

  async setUser(user, data = {}) {
    try {
      for (let prop in data) {
        user[prop] = data[prop];
      }
      await user.save();
      return user;
    } catch (e) {
      return null;
    }
  }

  async getSubscription(subscription = null) {
    try {
      const data =
        subscription && (await Subscription.findOne({ subscription }));
      return data;
    } catch (e) {
      return null;
    }
  }

  setPage(page = null) {
    this.currentPage = page;
  }

  async route(bot, chatId, props = {}) {
    const { text, message } = props;
    const page = props.page || this.currentPage;
    const command = text && text[0] == "/" ? text : null;
    if (!this.chatHash) {
      this.reinit(chatId);
    }

    let transition = false;
    if (this.currentPage && page != this.currentPage) {
      transition = true;
      this.setPage(page);
    }

    logger.log({
      level: "info",
      message:
        [text, chatId, props?.page, this.currentPage].join(", ") +
        " " +
        new Date().toJSON() +
        ";",
    });

    if (command) {
      switch (command) {
        case "/start":
          this.reinit(chatId);
          bot.sendSticker(
            chatId,
            `https://tlgrm.ru/_/stickers/d5d/cea/d5dcea3b-23f6-3976-a170-36e9281a0843/9.webp`
          );
          bot.sendMessage(
            chatId,
            "Приветствую в боте сервиса Navili! 🪬 Для дальнейшего общения, прошу представиться...",
            this.getButtons("start")
          );
          break;
        case "/info":
          const fullName = message.from.last_name
            ? `${message.from.first_name} ${message.from.last_name}`
            : message.from.first_name;
          bot.sendMessage(
            chatId,
            `Ты указал, что тебя зовут ${fullName}. \nКод нашей беседы: ${this.chatHash}`
          );
          break;
        default:
          bot.sendMessage(chatId, `Прости, но я не знаю такой команды.`);
      }
      return;
    }

    const link = `${config.frontURL}/api/ref?tg=${this.chatHash}`;
    console.log(link);
    if (this.user.role !== "guest") {
      switch (page) {
        case "Меню":
          bot.sendMessage(
            chatId,
            `Снова приветствую Вас в главном меню, уважаемый ${this.user.name}!`,
            { parse_mode: "Markdown", ...this.getButtons("user-menu") }
          );
          return;
        case "Информация":
          const subsData = null; //this.getSubscription(this.user.subscription);
          const achievements =
            this.user?.achievements && this.user?.achievements.length
              ? this.user.achievements.join(", ")
              : "ещё не свершились";
          const subscriptionInfo = subsData ? subsData : "отсуствуют";
          let gradeInfo = "";
          switch (this.user.grade) {
            case 1:
              gradeInfo = "Вижу ты только начал свой путь! Так держать!";
            case 2:
              gradeInfo = "О сумрачный воин! Ты уже сделал свой первый шаг...";
            case 3:
              gradeInfo =
                "Добро пожаловать, небесный странник! Вижу ты уже приуспел на своём пути.";
            case 4:
              gradeInfo =
                "Генерал четырёх пределов, рад приветствовать тебя здесь.";
            case 5:
              gradeInfo = "Межгалактический нагибатор, а ты хорош!";
            default:
              gradeInfo =
                "О мудрец трёх сосен, мне не удалось загрузить твой статус. Но ты крут!";
          }
          bot.sendMessage(
            chatId,
            `*Ваши активные подписки:* ${subscriptionInfo}.\n\n*Чайные свершения:* ${achievements}.\n\n_${gradeInfo}_`,
            { parse_mode: "Markdown", ...this.getButtons("away") }
          );
          return;
        case "Мой статус":
          bot.sendMessage(
            chatId,
            `*Статус доставки:* ${"в обработке"}\n\n*Адрес доставки:* ${"в обработке"}\n\n*Доставка длится:* ${"3 дня"}\n\n*Номер доставки:* ${"197556214"}`,
            { parse_mode: "Markdown", ...this.getButtons("delivery") }
          );
          return;
        case "Акции":
          const sales = salesArray.map((item) => "• " + item).join("\n");
          bot.sendMessage(chatId, `*Акции доступные Вам:* \n${sales}`, {
            parse_mode: "Markdown",
            ...this.getButtons("away"),
          });
          return;
        case "Помощь":
          bot.sendMessage(
            chatId,
            `Чем мы можем Вам помочь? Вот [наш новостной канал](https://news.google.com/home?hl=ru&gl=RU&ceid=RU%3Aru), возможно Ваша проблема уже решена.\n\nЕщё остались вопросы?`,
            { parse_mode: "Markdown", ...this.getButtons("help") }
          );
          return;
        case "Вопросы":
          bot.sendMessage(
            chatId,
            `Вот список вопросов и ответов или тут будет ссылка на более обширная структура. Я пока хз...`
          );
          return;
        case "Сообщить о проблеме":
          if (transition) {
            bot.sendMessage(
              chatId,
              `Пожалуйста, опишите свою проблему и мы ответим Вам как можно скорее.\n\n_Убедительная просьба не флудить_`,
              { parse_mode: "Markdown", ...this.getButtons("away") }
            );
          } else {
            bot.sendMessage(
              chatId,
              `Спасибо за обращение! Текст Вашего обращения:\n\n_${text}_\n\nМы ответим Вам в ближайшее время.`,
              { parse_mode: "Markdown", ...this.getButtons("away") }
            );
          }
          return;
        case "Выйти":
          this.reinit(chatId);
          bot.sendMessage(
            chatId,
            `Благодарю за взаимодействие. До новых встреч!`,
            { parse_mode: "Markdown", ...this.getButtons("user-menu") }
          );
          return;
        default:
          bot.sendMessage(
            chatId,
            `Какое досадное недоразумение! Вероятно я задремал и забыл на чём мы с тобой остановились...`,
            { parse_mode: "Markdown", ...this.getButtons("user-menu") }
          );
          return;
      }
    } else {
      switch (page) {
        case "Авторизация":
          if (transition) {
            const pathQr = `./public/img/qr/${chatId}.png`;
            const qrOptions = {
              errorCorrectionLevel: "H",
              type: "image/png",
              quality: 0.92,
              margin: 1,
            };
            const newQrRef = qr.toFile(pathQr, link, qrOptions, (err) => {
              if (err) {
                bot.sendMessage(
                  chatId,
                  `Что-то пошло не так и QR код не смог сформироваться, мы уже работаем над этим`
                );
              } else {
                bot.sendPhoto(chatId, pathQr);
              }
            });
            bot.sendMessage(
              chatId,
              `Воспользуйтесь QR кодом или [этой ссылкой](${link}) для авторизации через сайт. \nТакже Вы можете указать секретный ключ из личного кабинета в ответе на данное сообщение.`,
              { parse_mode: "Markdown" }
            );
          } else {
            const user = await this.getUser(text);
            if (user) {
              const update = await this.setUser(user, {
                chat_hash: this.chatHash,
                chat_id: chatId,
              });
              if (update) {
                this.user = {
                  role: user._doc.status,
                  name: user._doc.login,
                  ...user,
                };
                this.chatKey = text;
                bot.sendMessage(
                  chatId,
                  `Добро пожаловать в личный кабинет, ${this.user.name}. Чем я могу помочь?`,
                  { parse_mode: "Markdown", ...this.getButtons("user-menu") }
                );
              } else {
                logger.log({
                  level: "error",
                  message:
                    [text, chatId, user._doc.login].join(", ") +
                    ", update " +
                    new Date().toJSON() +
                    ";",
                });
                bot.sendMessage(
                  chatId,
                  `Уважаемый, ${this.user.name}. К сожалению возникла непредвиденная ошибка авторизации. Мы уведомили поддержку о Вашей проблеме. Пожалуйста, подождите, мы скоро с Вами свяжемся.`
                );
              }
            } else {
              bot.sendMessage(
                chatId,
                `Код неверен или указан некорректно.`,
                this.getButtons("login")
              );
            }
          }
          return;
        case "Регистрация":
          bot.sendMessage(
            chatId,
            `Вот Ваша [ссылка для регистрации](${link}) на нашем сервисе. Добро пожаловать!`,
            { parse_mode: "Markdown" }
          );
          return;
        default:
          bot.sendMessage(
            chatId,
            "И снова приветствую! 🪬 Но для дальнейшего общения, всё же нужно представиться...",
            this.getButtons("start")
          );
          return;
      }
    }

    bot.sendMessage(chatId, `Как ты сюда попал?`, this.getButtons());
  }

  createInvoice (bot, chatId, payment) {
    bot.sendInvoice(chatId)
  }

  getButtons(type) {
    switch (type) {
      case "start":
        return {
          reply_markup: JSON.stringify({
            keyboard: [
              [
                { text: `✔️ Авторизация` },
                { text: "📃 Регистрация", callback_data: "page/registration" },
              ],
            ],
            resize_keyboard: true,
          }),
        };
      case "user-menu":
        return {
          reply_markup: JSON.stringify({
            keyboard: [
              [
                { text: "🖥 Информация ", callback_data: "page/info" },
                { text: "🪪 Мой статус", callback_data: "page/satus" },
              ],
              [
                { text: "🛍 Акции", callback_data: "page/sales" },
                { text: "🛟 Помощь", callback_data: "page/help" },
              ],
              [{ text: "❌ Выйти", callback_data: "page/exit" }],
            ],
            resize_keyboard: true,
          }),
        };
      case "login":
        return {
          reply_markup: JSON.stringify({
            keyboard: [[{ text: "❌ Назад" }]],
            resize_keyboard: true,
          }),
        };
      case "away":
        return {
          reply_markup: JSON.stringify({
            keyboard: [[{ text: "📱 Меню" }]],
            resize_keyboard: true,
          }),
        };
      case "delivery":
        return {
          reply_markup: JSON.stringify({
            keyboard: [
              [{ text: "📱 Меню" }, { text: "❗️ Сообщить о проблеме" }],
            ],
            resize_keyboard: true,
          }),
        };
      case "help":
        return {
          reply_markup: JSON.stringify({
            keyboard: [
              [{ text: "❓ Вопросы" }, { text: "❗️ Сообщить о проблеме" }],
            ],
            resize_keyboard: true,
          }),
        };
      default:
        return {
          reply_markup: JSON.stringify({
            keyboard: [
              [
                { text: "📱 На главную", callback_data: "goto_top" },
                { text: "❗️ Сообщить об ошибке", callback_data: "error" },
              ],
            ],
            resize_keyboard: true,
          }),
        };
    }
  }
}

module.exports = TelegramBotService;
