const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  location: {
    city: { type: String, required: true },
    lat: { type: Number, required: false },
    lon: { type: Number, required: false },
  },
});
const subscriptionSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  subscriptions: [locationSchema],
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = { Subscription };
