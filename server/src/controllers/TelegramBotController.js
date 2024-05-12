const TelegramBotService = require("../services/TelegramBotService");
const User = require('../models/User');
const pageMarker = " ";

class TelegramBotController {
    constructor(bot) {
        if(TelegramBotController.instance){
            return TelegramBotController.instance;
        }

        this.botInstances = new Map();
        this.bot = bot;
        
        User.find({ chat_id: { $ne: null }} , { chat_id: 1, chat_key: 1 }).then(
            (users) => {
                users.map( user => this.reinit(user.chat_id));
            }
        ).catch((error) => {
            console.log('reinitError:', error);
        });

        TelegramBotController.instance = this;
    }

    async reinit(chatId) {
        const instance = new TelegramBotService();
        await instance.reinit(chatId, this.bot);
        this.botInstances.set(chatId, instance);
    }

    getInstance(chatId) {
        return this.botInstances.get(chatId);
    }

    getList() {
        return this.botInstances;
    }

    async route(bot, chatId, props = {}) {
        let instance = this.getInstance(chatId);
        if (!instance) {
            await this.reinit(chatId, bot);
            instance = this.getInstance(chatId);
        }
        instance.route(bot, chatId, props);
    }

    runBot() {
        const bot = this.bot;

        bot.setMyCommands([
            { command: '/start', description: 'Запуск бота' },
            { command: '/info', description: 'Краткая информация о пользователе' },
        ]);

        bot.on('message', async (msg) => {
            const text = msg.text;
            const chatId = msg.chat.id;

            if (text.includes(pageMarker)) {
                const pageName = text.substring(text.indexOf(pageMarker) + 1);
                this.route(bot, chatId, { page: pageName, message: msg });
            } else {
                this.route(bot, chatId, { text, message: msg });
            }
        });

        bot.on('callback_query', (msg) => {
            const data = msg.data;
            const chatId = msg.message.chat.id;

            if (data && data.substring(0, 4) === 'page') {
                this.route(bot, chatId, { page: data });
            } else {
                this.route(bot, chatId, { data });
            }
        });
    }
};

module.exports = TelegramBotController;