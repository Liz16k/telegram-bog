const { Markup } = require("telegraf");
const { Subscription } = require("../models/Subscription");
const { fetchDBCollection } = require("../database");

async function fetchSubscriptions(userId = null) {
  try {
    const response = await fetchDBCollection(
      Subscription,
      userId ? { userId: userId } : {}
    );
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchSubsListKeyboard(userId, extraBtn, btnChar) {
  try {
    const userSubscriptionDoc = await fetchSubscriptions(userId);
    let keyboard = Markup.inlineKeyboard([
      ...userSubscriptionDoc[0].subscriptions.map((sub) => [
        Markup.button.callback(
          `${sub.location.city} ${btnChar}`,
          JSON.stringify({
            city: sub.location.city,
            userId: userId,
          })
        ),
      ]),
      [
        Markup.button.callback(
          extraBtn.text,
          JSON.stringify({ type: extraBtn.data })
        ),
      ],
    ])
      .resize()
      .oneTime();
    return keyboard;
  } catch (error) {
    console.log("fetchSubsListKeyboard ", error.message);
  }
}

module.exports = { fetchSubscriptions, fetchSubsListKeyboard };
