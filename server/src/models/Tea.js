const {Schema, model, trusted} = require('mongoose');

const Tea = new Schema({
    created_at: {type: Date},
    updated_at: {type: Date},
    name: {type: String, requiried: true},
    title: {type: String, requiried: true},
    description: {type: String},
    storage: {type: Number, default: 0},
    limit: {type: Number, default: 0},
    class: {type: String, default: 'none'},
    cost_in: {type: Number, default: 0},
    cost_retail: {type: Number},
    cost_sale: {type: Number, default: 0},
    package_type: {type: String, default: 'g'},
    tags: {type: Array},
    active: {type: Boolean, default: false},
    state: {type: String},
    analogs: {type: Array},
    notion_id: {type: String},
})

module.exports = model('Tea', Tea);