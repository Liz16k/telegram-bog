const mongoose = require("mongoose");

const dbURL =
  "mongodb+srv://liz:admin@dbfortgchatbot.zaprkms.mongodb.net/?retryWrites=true&w=majority";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  location: {
    city: { type: String },
    lat: { type: Number },
    lon: { type: Number },
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

async function fetchDBCollection(model, options = {}) {
  try {
    await mongoose.connect(dbURL);
    return await model.find(options);
  } catch (error) {
    console.error("Не удалось получить коллекцию", error);
  }
}

module.exports = { Subscription, fetchDBCollection };
