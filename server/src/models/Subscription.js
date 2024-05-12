const { Schema, model, trusted } = require("mongoose");

const Subscription = new Schema({
  created_at: { type: Date },
  updated_at: { type: Date },
  contact: { type: String },
  boxes: { type: Array },
  status: { type: String },
  period: { type: Object },
  comments: { type: String },
  delivery: { type: Array },
  user_id: { type: Object },
  payments_confirmed: { type: Array },
  uuid: { type: String }
});

module.exports = model("Subscription", Subscription);
