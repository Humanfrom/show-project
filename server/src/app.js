const mongoose = require('mongoose');
const config = require('config');
const TelegramApi = require('node-telegram-bot-api');
const TelegramBotController = require('./controllers/TelegramBotController');
const winston = require('winston');

// Создание логгера
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './public/logs/errors.log' }),
    ],
});

const PORT = config.get('serverPort');
//const bot = new TelegramApi(config.get('tgBotToken'), {polling: true});

const start = async (app) => {
    try {
        await mongoose.connect(config.get('dbUrl'));

        /*const newBot = new TelegramBotController(bot);
        newBot.runBot();*/

        app.listen(PORT, () => {
            console.log('Server started on port', PORT);
        });
    } catch (e) {
        console.log(e);
        logger.log({
            level: 'info',
            message: e + " " + (new Date()).toJSON(),
        });
    }
}

module.exports = start;