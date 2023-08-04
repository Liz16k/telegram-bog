import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  location: {
    city: { type: String, required: true },
    lat: { type: Number, required: false },
    lon: { type: Number, required: false },
  },
});
const subscriptionSchema = new Schema({
  userId: { type: Number, required: true },
  subscriptions: [locationSchema],
});

const Subscription = model("Subscription", subscriptionSchema);

export default { Subscription };
