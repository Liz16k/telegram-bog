import { Markup } from "telegraf";
import { Subscription } from "#models/Subscription.js";
import { fetchDBCollection } from "../database.js";
import { logMsgs } from "#config/constants.js";
import { userSubsKeyboard } from "#config/keyboards.js";

async function fetchSubscriptions(userId = null) {
  try {
    const response = await fetchDBCollection(
      Subscription,
      userId ? { userId: userId } : {}
    );
    return response;
  } catch (error) {
    console.error(logMsgs.ERROR.FETCH, error.message);
  }
}

async function fetchSubsListKeyboard(userId, extraBtn, btnChar) {
  try {
    const userSubscriptionDoc = await fetchSubscriptions(userId);
    return userSubsKeyboard({ userId, extraBtn, btnChar, userSubscriptionDoc });
  } catch (error) {
    console.error(logMsgs.ERROR.KEYBOARD, error.message);
  }
}

export { fetchSubscriptions, fetchSubsListKeyboard };
