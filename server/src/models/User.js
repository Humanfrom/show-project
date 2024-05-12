const {Schema, model, trusted} = require('mongoose');

const User = new Schema({
    created_at: {type: Date},
    updated_at: {type: Date},
    personal: {type: Object},
    login: {type: String, requiried: true, unique: true},
    password: {type: String, requiried: true},
    grade: {type: Number, default: 0},
    contact: {type: String, requiried: true},
    contact_type: {type: String, default: 'tg'},
    status: {type: String, default: 'user'},
    confirmed: {type: Boolean, default: false},
    last_activity: {type: Date},
    subscriptions: {type: Array},
    active_subscription: {type: String, default: null},
    info: {type: String},
    achievements: {type: Array},
    hash: {type: String, default: null},
    chat_hash: {type: String, default: null},
    chat_key: {type: String, default: null},
    chat_id: {type: Number, default: null},
    active: {type: Boolean, default: true},
    delivery: {type: Array}
})

module.exports = model('User', User);