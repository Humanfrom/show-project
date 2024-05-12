const {Schema, model, trusted} = require('mongoose');

const Box = new Schema({
    created_at: {type: Date},
    updated_at: {type: Date},
    name: {type: String, requiried: true},
    title: {type: String, required: true},
    description: {type: String},
    variants: {type: Object},
    status: {type: String},
    teas: {type: Array},
    level: {type: Number, default: 0},
    promotion: {type: Array},
    achievements: {type: Array},
    min_grade: {type: Number, default: 0},
    image: {type: String},
    notion_id: {type: String},
    active: {type: Boolean, default: false}
})

module.exports = model('Box', Box);