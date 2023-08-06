import { Markup } from "telegraf";
import { Subscription } from "#models/Subscription.js";
import { fetchDBCollection } from "../database.js";
import { logMsgs } from "#config/constants.js";

async function fetchSubscriptions(userId = null) {
  try {
    const response = await fetchDBCollection(
      Subscription,
      userId ? { userId: userId } : {}
    );
    return response;
  } catch (error) {
    console.log(logMsgs.ERROR.FETCH, error.message);
  }
}

async function fetchSubsListKeyboard(userId, extraBtn, btnChar) {
  try {
    const userSubscriptionDoc = await fetchSubscriptions(userId);
    let keyboard = Markup.inlineKeyboard([
      ...userSubscriptionDoc[0].subscriptions.map((sub) => {
        const { lat, lon, city } = sub.location;
        return [
          Markup.button.callback(
            `${sub.location.city} ${btnChar}`,
            JSON.stringify({
              params: lat ? `${lat}&${lon}` : city,
              userId: userId,
            })
          ),
        ];
      }),
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
    console.log(logMsgs.ERROR.KEYBOARD, error.message);
  }
}

export { fetchSubscriptions, fetchSubsListKeyboard };
