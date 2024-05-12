const bcrypt = require('bcryptjs');
const qr = require('qrcode');
const User = require('../models/User');
const winston = require('winston');

class AuthService {

    constructor() {
        this.chatHash = null;
        this.currentPage = 'К приветствию';
        this.pages = ['page/login','page/user-menu', 'page/info', 'page/satus', 'page/sales', 'page/help', 'page/problem'];
        this.user = { role: 'guest', name: 'гость'};
        this.chatKey = null;
    }

    getButtons (type) {

    }
}

module.exports = AuthService;