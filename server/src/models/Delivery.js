const {Schema, model, trusted} = require('mongoose');

const Delivery = new Schema({
    created_at: {type: Date},
    updated_at: {type: Date},
    user: {type: String},
    subscription: {type: String},
    status: {type: String},
    comment: {type: String},
    adress: {type: Object},
})

module.exports = model('Delivery', Delivery);