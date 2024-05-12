const bcrypt = require('bcryptjs');
const config = require('config');
const User = require('../models/User');
const winston = require('winston');
const TelegramBotController = require('../controllers/TelegramBotController');
const nodemailer = require('nodemailer');

class NotificationService {

    constructor() {
        this.chatHash = null;
    }

    sendConfirmation (userData) {
        switch (userData.contact_type) {
            case 'tg':
                const chatId = userData.chat_id;
                const bot = (new TelegramBotController()).getInstance(userData.chat_id);
                if(bot){
                    bot.sendMessage(chatId, `Какое досадное недоразумение!`);
                }
                return { error: "Ошибка. Не удалось отправить сообщение для восстановление." };
            case 'mail':
                const transporter = nodemailer.createTransport(config.mailServer);

                const mailOptions = {
                    from: config.mailServer.auth.user,
                    to: user.contact, 
                    subject: 'Восстановление пароля',
                    text: 'Вы пытались доступ к своему кабинету на сервисе NAVI-LI.\nПерейдите по этой ссылке, чтобы перейти к смене пароля.\nЕсли Вы этого не делали настоятельно рекомендуем обратиться в поддержку для защиты Вышего аккаунта.',
                  };
                  
                let result = { error: "Ошибка. Не удалось отправить письмо для восстановление." };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (!error) {
                      result = { success: true };
                    }
                });
                return result;    
        }
    }

    sendResetLink (user, hash) {
        const link = `${config.frontURL}/confirm?type=${user.contact_type}&ref=${hash}`;
        switch (user.contact_type) {
            case 'tg':
                const bot = (new TelegramBotController()).getInstance(user.chat_id);
                console.log('user.chat_id', user.chat_id);

                if(bot){
                    bot.sendMessage(user.chat_id, `Перейдите [по этой ссылке](${link}), чтобы начать процедуру смены пароля.`, { parse_mode: 'Markdown' });
                    return { success: true };
                }
                return { error: "Ошибка. Не удалось отправить сообщение для восстановление." };
            case 'mail':
                const transporter = nodemailer.createTransport(config.mailServer);

                const mailOptions = {
                    from: config.mailServer.auth.user,
                    to: user.contact, 
                    subject: 'Восстановление пароля',
                    text: 'Вы пытались доступ к своему кабинету на сервисе NAVI-LI.\nПерейдите по этой ссылке, чтобы перейти к смене пароля.\nЕсли Вы этого не делали настоятельно рекомендуем обратиться в поддержку для защиты Вышего аккаунта.',
                  };
                  
                let result = { error: "Ошибка. Не удалось отправить письмо для восстановление." };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (!error) {
                      result = { success: true };
                    }
                });
                return result;
            default:
                return { error: "Ошибка. Неверный запрос восстановления." }        
        }
    }


}

module.exports = new NotificationService;