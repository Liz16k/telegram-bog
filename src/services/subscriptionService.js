const { Subscription, fetchDBCollection } = require("../database");
const { Markup } = require("telegraf");

async function fetchSubscriptions(userId) {
  return await fetchDBCollection(Subscription, { userId: userId });
}

async function fetchUnsubListKeyboard(userId) {
  try {
    const subs = await fetchSubscriptions(userId);
    return Markup.inlineKeyboard(
      subs.map((sub) => {
        if (sub.location.city) {
          return [
            Markup.button.callback(
              `${sub.location.city} ❌`,
              JSON.stringify({
                city: sub.location.city,
                userId: sub.userId,
              })
            ),
          ];
        } else if (sub.location.lon) {
          return [
            Markup.button.callback(
              "какие-то координаты ❌",
              JSON.stringify({
                lat: sub.location.lat,
                lon: sub.location.lon,
                userId: sub.userId,
              })
            ),
          ];
        }
      })
    )
      .resize()
      .oneTime();
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { fetchSubscriptions, fetchUnsubListKeyboard };
